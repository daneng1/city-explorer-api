'use strict';

const movieKey = process.env.MOVIE_API_KEY;
const superagent = require('superagent');

function Forecast(date, description, high_temp, low_temp) {
  this.date = date;
  this.desc = description;
  this.high = high_temp;
  this.low = low_temp;
}

function handleMovie(req, res) {
  const query = req.query.lat;
  console.log(req.query);
  const url = `https://api.themoviedb.org/3/movie/76341`;
  const queryMovie = {
    api_key: movieKey,
    query: query
  };

  console.log('made it to weather');

  superagent
    .get(url)
    .query(queryMovie)
    .then((results) => {
      const forecastArray = results.body.data.map((day) => new Forecast(day.datetime, day.weather.description, day.high_temp, day.low_temp)
      );
      console.log(forecastArray);
      res.status(200).send({
        lat: lat,
        lon: lon,
        forecast: forecastArray
      });
    }).catch((err) =>{
      console.log('error in weather', err);
      res.status(500).send('something went wrong');
    });
}

module.exports = handleMovie;
