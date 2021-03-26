'use strict';

// dotenv allows us to access variables from the .env file
require('dotenv').config();

// express is used to build our server
const express = require('express');

// initializes the server
const app = express();

// cors allows front end to access the backend
const cors = require('cors');

// allows everyone to acces the server
app.use(cors());

const PORT = process.env.PORT || 3002;

// superagent allows us to talk to the API's, out carrier pigeons

app.get('/', (request, response) => {
  response.send('hello world');
});

const getMovies = require('./components/movies');
const getWeather = require('./components/weather');
// route
app.get('/weather', getWeather);
app.get('/movies', getMovies);

app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});

// this turns on the server, check by running nodemon in term, should see "listenting on 3001"
app.listen(PORT, () => console.log(`listening on ${PORT}`));
