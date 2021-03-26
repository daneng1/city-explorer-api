'use strict';

const weatherKey = process.env.WEATHER_API_KEY;
const superagent = require('superagent');

function Forecast(date, description, high_temp, low_temp) {
  this.date = date;
  this.desc = description;
  this.high = Math.floor(high_temp * 9 / 5 + 32);
  this.low = Math.floor(low_temp * 9 / 5 + 32);
}

function handleWeather(req, res) {
  const lat = req.query.lat;
  const lon = req.query.lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily`;
  const queryWeather = {
    key: weatherKey,
    lat: lat,
    lon: lon,
    days: 5
  };

  console.log('made it to weather');

  superagent
    .get(url)
    .query(queryWeather)
    .then((results) => {
      const forecastArray = results.body.data.map((day) => new Forecast(day.datetime, day.weather.description, day.high_temp, day.low_temp)
      );
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

module.exports = handleWeather;
