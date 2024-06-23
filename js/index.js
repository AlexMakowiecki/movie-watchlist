const apiKey = "141607ef"
const movieSearchForm = document.getElementById("movie-search-form")
const movieListEl = document.getElementById("movie-list")
let currentMoviesInformation = []
/* ---------------------------------
Handle of movie search 
------------------------------------*/

movieSearchForm.addEventListener("submit", handleMovieSearchSubmit)

async function handleMovieSearchSubmit(e) {
  e.preventDefault()
  try {
    const moviesAddress = await getMoviesAddress()
    await renderMovies(moviesAddress)
    showMovieList()
    movieSearchForm.reset()
  } catch (err) {
    const errorMsg = err.message;
    console.log(err)
    if (errorMsg === "Too many results.") showMovieListPlaceholder('<p>Too many results. Please try with a more specific name</p>')
    if (errorMsg === "Movie not found!") showMovieListPlaceholder('<p>Unable to find what you’re looking for. Please try another search.</p>')
  }
}

async function getMoviesAddress() {
  const movieName = document.getElementById("movie-input").value
  const searchResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}`)
  const searchData = await searchResponse.json()
  if (searchData.Response.toLowerCase() === "false") throw new Error(searchData.Error)
  return searchData.Search;
}

async function renderMovies(moviesAddress) {

  const localMoviesData = JSON.parse(localStorage.getItem("localMoviesData")) 

  let movieListInnerHTML = ""
  for (movieAddress of moviesAddress){
    const movieData = await getMovieData(movieAddress.imdbID)
    const { Title: title, Genre: genre, 
            Plot: desc, Poster: img,
            Runtime: duration, imdbRating: rating } = movieData;

    
    let addButtonState = ""
    let removeButtonState = ""
    const isMovieInLocalStorage = (localMoviesData) 
                                  ? localMoviesData.some( localMovie => localMovie.imdbID === movieData.imdbID)
                                  : null
    if (isMovieInLocalStorage) addButtonState = "hidden"
    else removeButtonState = "hidden"

    currentMoviesInformation.push(movieData)

    movieListInnerHTML += `
    <li class="movie-container">
        <img class="movie-img" src="${(img === "N/A") ? "/imgs/no-image.png" : img}"/>
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
            <button data-group="add-movie-button" data-imdb-id="${movieAddress.imdbID}" class="${addButtonState}">
              <i class="fa-solid fa-circle-plus"></i>
              <span class="small">Watchlist</span>
            </button>
            <button data-group="remove-movie-button" data-imdb-id="${movieAddress.imdbID}" class="${removeButtonState}">
              <i class="fa-solid fa-circle-minus"></i>
              <span class="small">Watchlist</span>
            </button>
          </div>
          <div class="movie-bottom">
            <p>${desc}</p>
          </div>
        </div>
      </li>`
  }
  movieListEl.innerHTML = movieListInnerHTML;
}

async function getMovieData(movieId) {
  const movieResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
  const movieData = await movieResponse.json()
  if (movieData.Response.toLowerCase() === "false") throw new Error(searchData.Error)
  return movieData
}

function showMovieList(){
  const movieListPlaceholderEl = document.getElementById("movie-list-placeholder")
  movieListEl.removeAttribute("hidden")
  movieListPlaceholderEl.setAttribute("hidden", "true")
}

function showMovieListPlaceholder(content){
  const movieListPlaceholderEl = document.getElementById("movie-list-placeholder")
  movieListPlaceholderEl.innerHTML = content
  movieListPlaceholderEl.removeAttribute("hidden")
  movieListEl.setAttribute("hidden", "true")
}

/* ---------------------------------
Handle of add/remove to watchlist button
------------------------------------*/

movieListEl.addEventListener("click", handleWatchlistButton)

function handleWatchlistButton(e){
  const selectedElement = e.target
  if (selectedElement.dataset.group === "add-movie-button") {
    const selectedImdbID = e.target.dataset.imdbId
    const selectedMovieData = currentMoviesInformation.find( movieData => movieData.imdbID === selectedImdbID)
    const localMoviesData = JSON.parse(localStorage.getItem("localMoviesData")) || []
    localMoviesData.push(selectedMovieData)
    localStorage.setItem("localMoviesData", JSON.stringify(localMoviesData))
    selectedElement.classList.toggle("hidden")
    selectedElement.parentElement.querySelector(`[data-group="remove-movie-button"]`).classList.toggle("hidden")
  }
  else if (selectedElement.dataset.group === "remove-movie-button") {
    const selectedImdbID = e.target.dataset.imdbId
    const localMoviesData = JSON.parse(localStorage.getItem("localMoviesData"))
    const updatedLocalMoviesData = localMoviesData.filter( movieData => movieData.imdbID !== selectedImdbID)
    
    if (updatedLocalMoviesData.length === 0) localStorage.removeItem("localMoviesData")
    else localStorage.setItem("localMoviesData", JSON.stringify(updatedLocalMoviesData))
    selectedElement.classList.toggle("hidden")
    selectedElement.parentElement.querySelector(`[data-group="add-movie-button"]`).classList.toggle("hidden")
  }
}




