'use strict';

let cache = require('./cache.js');
const superagent = require('superagent');
const { response } = require('express');

function getMovies(city) {
  const key = 'movies-' + city;
  const url = 'https://api.themoviedb.org/3/search/movie';
  const queryParams = {
    api_key: process.env.MOVIE_API_KEY,
    query: city,
    language: 'en-US'
  };
  console.log('Search query;', queryParams);

  if (cache[key] && (Date.now() - cache[key].timestamp < 2.592e+9)) {
    console.log('Cache hit for movies', cache[key]);
    response.status(200).send(cache[key]);
  } else {
    console.log('Cache miss for movies');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent
      .get(url)
      .query(queryParams)
      .then(results => {
        // console.log(results);
        const movieArray = parseMovies(results.body);
        return movieArray;
      });
    return cache[key].data;
  }

}

function parseMovies(movieData) {
  // console.log('Movie Data:', movieData);
  try {
    const movieSummaries = movieData.results.map(movie => {
      return new Movie(movie);
    });
    // console.log('movieSummaries:', {movieSummaries});
    return Promise.resolve(movieSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Movie {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.poster = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
    this.releaseDate = movie.release_date;
  }
}

module.exports = getMovies;
