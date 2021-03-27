'use strict';

let cache = require('./cache.js');
const superagent = require('superagent');
const { response } = require('express');

function getWeather(latitude, longitude) {
  const key = 'weather-' + latitude + longitude;
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    lang: 'en',
    lat: latitude,
    lon: longitude,
    days: 5,
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit for weather');
    response.status(200).send(cache[key]);
  } else {
    console.log('Cache miss for weather');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent
      .get(url)
      .query(queryParams)
      .then(results => {
        const forcastArray = parseWeather(results.body);
        return forcastArray;
      });
    return cache[key].data;
  }

}

function parseWeather(weatherData) {
  // console.log('weather.parseWeather:', weatherData);
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    console.log('weatherSummaries:', weatherSummaries);
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
    this.high = Math.floor(day.high_temp * 9 / 5 + 32);
    this.low = Math.floor(day.low_temp * 9 / 5 + 32);
  }
}

module.exports = getWeather;
