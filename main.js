const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=b461c1dd';
const trendingMovies = ['tt0111161', 'tt0068646', 'tt0468569', 'tt1375666', 'tt0137523'];  // Sample movie IDs
let watchlist = [];

// Fetch movie details from OMDb API
async function fetchMovie(id) {
    const response = await fetch(`${OMDB_API_URL}&i=${id}`);
    const movie = await response.json();
    
    // Check if response is valid and handle missing fields
    if (movie.Response === 'True') {
        return {
            title: movie.Title || 'Title Not Available',
            poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image',
            imdbID: movie.imdbID || 'Unknown',
            plot: movie.Plot || 'Plot not available.',
            director: movie.Director || 'Director not available.',
            releaseDate: movie.Released || 'Release date not available.'
        };
    } else {
        return null;  // Handle API failure case
    }
}

// Render trending movies
async function renderTrendingMovies() {
    const trendingContainer = document.getElementById('trendingContainer');
    trendingContainer.innerHTML = '';  // Clear previous content
    for (const movieId of trendingMovies) {
        const movie = await fetchMovie(movieId);
        if (movie) {
            const movieCard = `
                <div class="col-md-4 movie-card">
                    <div class="card">
                        <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                        <div class="card-body">
                            <h5 class="card-title">${movie.title}</h5>
                            <button class="btn btn-primary" onclick="showMovieDetails('${movie.imdbID}')">Details</button>
                            <button class="btn btn-secondary mt-2" onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
                        </div>
                    </div>
                </div>
            `;
            trendingContainer.innerHTML += movieCard;
        } else {
            console.error(`Movie data for ID: ${movieId} could not be fetched.`);
        }
    }
}

// Search movies based on user input
async function searchMovies() {
    const searchInput = document.getElementById('searchInput').value;
    const response = await fetch(`${OMDB_API_URL}&s=${searchInput}`);
    const data = await response.json();

    if (data.Response === 'True') {
        const movies = data.Search.map(movie => ({
            title: movie.Title,
            poster: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image',
            imdbID: movie.imdbID
        }));
        renderSearchResults(movies);
    } else {
        alert('No results found.');
    }
}

// Render search results
function renderSearchResults(movies) {
    const trendingContainer = document.getElementById('trendingContainer');
    trendingContainer.innerHTML = '';  // Clear trending section to show search results

    movies.forEach(movie => {
        const movieCard = `
            <div class="col-md-4 movie-card">
                <div class="card">
                    <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <button class="btn btn-primary" onclick="showMovieDetails('${movie.imdbID}')">Details</button>
                        <button class="btn btn-secondary mt-2" onclick="addToWatchlist('${movie.imdbID}')">Add to Watchlist</button>
                    </div>
                </div>
            </div>
        `;
        trendingContainer.innerHTML += movieCard;
    });
}

// Show movie details
async function showMovieDetails(imdbID) {
    const movie = await fetchMovie(imdbID);
    const movieDetails = document.getElementById('movieDetails');
    
    movieDetails.innerHTML = `
        <h3>${movie.title}</h3>
        <img src="${movie.poster}" alt="${movie.title}">
        <p><strong>Plot:</strong> ${movie.plot}</p>
        <p><strong>Director:</strong> ${movie.director}</p>
        <p><strong>Release Date:</strong> ${movie.releaseDate}</p>
    `;
}

// Add movie to watchlist
function addToWatchlist(imdbID) {
    if (!watchlist.includes(imdbID)) {
        watchlist.push(imdbID);
        renderWatchlist();
    } else {
        alert('This movie is already in your watchlist.');
    }
}

// Render watchlist
async function renderWatchlist() {
    const watchlistContainer = document.getElementById('watchlistContainer');
    watchlistContainer.innerHTML = '';  // Clear previous content
    
    for (const imdbID of watchlist) {
        const movie = await fetchMovie(imdbID);
        const movieCard = `
            <div class="col-md-4 movie-card">
                <div class="card">
                    <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.title}</h5>
                        <button class="btn btn-danger" onclick="removeFromWatchlist('${imdbID}')">Remove from Watchlist</button>
                    </div>
                </div>
            </div>
        `;
        watchlistContainer.innerHTML += movieCard;
    }
}

// Remove movie from watchlist
function removeFromWatchlist(imdbID) {
    watchlist = watchlist.filter(id => id !== imdbID);
    renderWatchlist();
}

// Initialize trending movies on page load
document.addEventListener('DOMContentLoaded', renderTrendingMovies);
