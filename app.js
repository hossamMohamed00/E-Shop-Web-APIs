//? Read the .env file
require('dotenv/config');
const express = require('express');
const cors = require('cors');
const authJwt = require('./middleware/authJwt');

const app = express();

//* Configuration
app.use(cors());
app.options('*', cors());
app.use(authJwt());// add express-jwt middleware to ensure authorization 

//* Startup The Application
require('./startup/routes')(app);
require('./startup/db')();

//* Run the Application
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server now listening on port ${port}!`));
