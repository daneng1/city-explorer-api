'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const weatherKey = process.env.WEATHER_API_KEY;
const movieKey = process.env.MOVIE_API_KEY;
const app = express();
const PORT = process.env.PORT || 3002;
const superagent = require('superagent');
const { response } = require('express');


app.use(cors());

app.get('/weather', handleWeather);

app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});

function handleWeather(req, res) {
  const { lat, lon } = req.query;
  console.log(req.query);
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherKey}`;
  console.log('made it to weather');

  superagent.get(url)
    .query(lat, lon)
    .then(results => {
      const forecastArray = results.body.data.map(day => {
        return new Forecast(day);
      });
      res.status(200).send(forecastArray);
    }).catch((err) =>{
      console.log(err);
      response.status(500).send('something went wrong');
    });
}

function Forecast(obj, city, lat, lon) {
  this.desc = obj.weather.description;
  this.date = obj.datetime;
  this.city = city;
  this.lat = lat;
  this.lon = lon;
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
