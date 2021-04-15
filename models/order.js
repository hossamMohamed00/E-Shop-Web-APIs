/**
 * * Order Model.
 */

const mongoose = require('mongoose');
const OrderItems = require('./orderItem');

const orderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true
    }
  ],
  shippingAddress1: {
    type: String,
    required: true
  },
  shippingAddress2: {
    type: String
  },
  city: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    required: true
  },
  totalPrice: {
    type: Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateOrdered: {
    type: Date,
    default: Date.now
  }
});

//? Get id without underscore (_id) ==> id
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
