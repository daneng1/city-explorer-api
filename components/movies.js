'use strict';

const movieKey = process.env.MOVIE_API_KEY;
const superagent = require('superagent');

function Movie(title, overview, poster_path, release_date) {
  this.title = title;
  this.overview = overview;
  this.poster = `https://image.tmdb.org/t/p/w200${poster_path}`;
  this.releaseDate = release_date;
}

function handleMovie(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie`;
  const queryMovie = {
    api_key: movieKey,
    query: req.query.searchQuery,
    language: "en-US"
  };

  console.log('made it to movies');

  superagent
    .get(url)
    .query(queryMovie)
    .then((results) => {
      console.log(results.body);
      const movieArray = results.body.results.map((film) => new Movie(film.title, film.overview, film.poster_path, film.release_date)
      );
      console.log(movieArray[0]);
      res.status(200).send({
        movies: movieArray
      });
    }).catch((err) =>{
      console.log('error in movies', err);
      res.status(500).send('something went wrong');
    });
}

module.exports = handleMovie;
