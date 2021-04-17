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
app.use('/public/uploads', express.static(__dirname + '/public/uploads')); // serve the static files

//* Startup The Application
require('./startup/routes')(app);
require('./startup/db')();

//? Load the production module 
require('./startup/prod')(app); 

//* Run the Application
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server now listening on port ${port}!`));
