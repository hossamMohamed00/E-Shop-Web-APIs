const express = require('express');
const morgan = require('morgan');

const apiRoute = process.env.API_URL;

//? Load Routes
const home = require('../routes/home');
const product = require('../routes/products');
const order = require('../routes/orders');
const category = require('../routes/categories');
const user = require('../routes/users');
const errorMiddleware = require('../middleware/errorHandler');

module.exports = (app) => {
  app.use(morgan('dev')); //* Logger for the incoming requests.
  app.use(express.json());

  /*  Routes  */
  app.use(`${apiRoute}/`, home);
  app.use(`${apiRoute}/products`, product);
  app.use(`${apiRoute}/orders`, order);
  app.use(`${apiRoute}/categories`, category);
  app.use(`${apiRoute}/users`, user);

  app.use(errorMiddleware); //* This route for error handling.
};;
