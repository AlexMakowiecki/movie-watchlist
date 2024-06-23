const movieListEl = document.getElementById("movie-list")

document.addEventListener('DOMContentLoaded', loadMovies)

function loadMovies(){
  const localMoviesData = JSON.parse(localStorage.getItem("localMoviesData"))
  console.log(localMoviesData)
  if (localMoviesData) {
    console.log('enter')
    renderMovies(localMoviesData)
    toggleMovieListVisibility()
  }
}

function toggleMovieListVisibility(){
  const movieListPlaceholderEl = document.getElementById("movie-list-placeholder")
  movieListEl.classList.toggle("hidden")
  movieListPlaceholderEl.classList.toggle("hidden")
}

function renderMovies(moviesData){
  if (moviesData.length === 0) { toggleMovieListVisibility(); return }
  movieListEl.innerHTML = moviesData.reduce((movieListInnerHTML, currentMovieData) => {
    const { Title: title, Genre: genre, 
      Plot: desc, Poster: img,
      Runtime: duration, imdbRating: rating, imdbID} = currentMovieData;
    return `
    ${ movieListInnerHTML }
    <li class="movie-container">
        <img class="movie-img" src="${img}"/>
        <div class="movie-info">
          <div class="movie-top">
            <h2>${title}</h2>
            <div class="small">
              <i class="fa-solid fa-star"></i>
              <span>${rating}</span>
            </div>
          </div>
          <div class="movie-middle">
            <p class="small">${duration}</p>
            <p class="small">${genre}</p>
            <button data-group="remove-movie-button" data-imdb-id="${imdbID}">
              <i class="fa-solid fa-circle-minus"></i>
              <span class="small">Watchlist</span>
            </button>
          </div>
          <div class="movie-bottom">
            <p>${desc}</p>
          </div>
        </div>
      </li>` 
  },"")

}

/* ---------------------------------
Handle of remove to watchlist button
------------------------------------*/

movieListEl.addEventListener("click", handleRemoveOfWatchlist)

function handleRemoveOfWatchlist(e){
  const selectedElement = e.target
  if (selectedElement.dataset.group === "remove-movie-button") {
    const selectedImdbID = e.target.dataset.imdbId
    const localMoviesData = JSON.parse(localStorage.getItem("localMoviesData"))
    const updatedLocalMoviesData = localMoviesData.filter( movieData => movieData.imdbID !== selectedImdbID)
    
    if (updatedLocalMoviesData.length === 0) localStorage.removeItem("localMoviesData")
    else localStorage.setItem("localMoviesData", JSON.stringify(updatedLocalMoviesData))

    renderMovies(updatedLocalMoviesData)
  }

}