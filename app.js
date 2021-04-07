//? Read the .env file
require('dotenv/config');
const cors = require('cors');

const express = require('express');
const app = express();

//* Configuration
app.use(cors());
app.options('*', cors());

//* Startup The Application
require('./startup/routes')(app);
require('./startup/db')();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server now listening on port ${port}!`));
