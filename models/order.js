/**
 * * Order Model.
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  image: String,
  phone: String,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
