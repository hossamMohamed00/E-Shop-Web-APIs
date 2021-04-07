/**
 * * Home route.
 */
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello To Our E-Shop!');
});

module.exports = router;
