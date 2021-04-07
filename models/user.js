/**
 * * User Model.
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  image: String,
  phone: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
