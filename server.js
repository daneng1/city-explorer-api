'use strict';

const express = require('express');

require('dotenv').config();

const cors = require('cors');

const weather = require('./data/weather.json');

const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.get('/weather', handleWeather);

function handleWeather(req, res) {
  console.log('made it to weather');
  const forecastArray = weather.data.map(day => {
    return new Forecast(day, weather.city_name, weather.lat, weather.lon);
  });
  res.status(200).send(forecastArray);
}

function Forecast(obj, city, lat, lon) {
  this.desc = obj.weather.description;
  this.date = obj.datetime;
  this.city = city;
  this.lat = lat;
  this.lon = lon;
}



app.listen(PORT, () => console.log(`listening on ${PORT}`));