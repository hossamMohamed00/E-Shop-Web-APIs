const User = require('../models/user');
const asyncMiddleware = require('../middleware/async');

module.exports.getUsers = asyncMiddleware(async (req, res, next) => {
  const usersList = await User.find();
  res.send(usersList);
});
