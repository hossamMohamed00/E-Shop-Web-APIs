const Order = require('../models/order');
const asyncMiddleware = require('../middleware/async');

module.exports.getOrders = asyncMiddleware(async (req, res, next) => {
  const orderList = await Order.find();
  res.send(orderList);
});
