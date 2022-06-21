const API_VERSION = "3";
const API_URL = `https://api.themoviedb.org/${API_VERSION}`;

const API_AXIOS = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
  }
});

const API_ENDPOINTS = {
  TRENDING: (mediaType, timeWindow) => [
    API_URL,
    "/trending",
    `/${mediaType}`,
    `/${timeWindow}`,
    `?api_key=${API_KEY}`,
  ].join(''),
  GENRE: (mediaType) => [
    API_URL,
    `/genre/${mediaType}/list`,
    `?api_key=${API_KEY}`,
  ].join(''),
  IMAGE: (size, imagePath) => [
    'https://image.tmdb.org/t/p',
    `/w${size}${imagePath}`,
  ].join('')
};

const GENRE_DATA = {};

const getTrendingMoviesPreview = async (mediaType, timeWindow) => {
  /*
  // Usando fetch
  const res = await fetch(API_ENDPOINTS.TRENDING(mediaType, timeWindow));
  const data = await res.json();
  */
  const { data } = await API_AXIOS(`/trending/${mediaType}/${timeWindow}`);
  const movies = data.results;

  //const trendingPreviewMoviesContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');
  trendingMoviesPreviewList.innerHTML = '';
  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', API_ENDPOINTS.IMAGE(300, movie.poster_path));
    movieContainer.appendChild(movieImg);
    trendingMoviesPreviewList.appendChild(movieContainer);
  });
}

const getCategoriesPreview = async (mediaType) => {
  /*
  // Usando fetch
  const res = await fetch(API_ENDPOINTS.GENRE(mediaType));
  const data = await res.json();
  */
  const { data } = await API_AXIOS(`/genre/${mediaType}/list`);
  const categories = data.genres;

  //const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');
  categoriesPreviewList.innerHTML = '';
  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');
    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', `id${category.id}`);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name.toLowerCase()}`;
    });
    const categoryTitleText = document.createTextNode(category.name);
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    categoriesPreviewList.appendChild(categoryContainer);
    // Load GENRE_DATA Objet
    if (Object.keys(GENRE_DATA).length < categories.length) {
      GENRE_DATA[category.id] = category.name;
    }
  });
}

const getMoviesByCategory = async (categoryId) => {
  const { data } = await API_AXIOS(`/discover/movie`, {
    params: {
      'with_genres': categoryId,
    }
  });
  const movies = data.results;

  genericList.innerHTML = '';
  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', API_ENDPOINTS.IMAGE(300, movie.poster_path));
    movieContainer.appendChild(movieImg);
    genericList.appendChild(movieContainer);
  });
}