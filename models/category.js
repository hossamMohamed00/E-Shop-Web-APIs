/**
 * * Category Model.
 */
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
     type: String,
     required: true
  },
  color: { //ex: #0000
     type: String
  },
  icon: {
     type: String
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
