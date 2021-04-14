const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const asyncMiddleware = require('../middleware/async');

module.exports.getOrders = asyncMiddleware(async (req, res, next) => {
  const orderList = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 });
  res.send(orderList);
});

module.exports.createOrder = asyncMiddleware(async (req, res, next) => {
  const requestBody = req.body;

  //* Create order item first
  const orderItemsIds = await createOrderItems(requestBody);

  let order = new Order({
    orderItems: orderItemsIds,
    shippingAddress1: requestBody.shippingAddress1,
    shippingAddress2: requestBody.shippingAddress2,
    city: requestBody.city,
    zip: requestBody.zip,
    country: requestBody.country,
    phone: requestBody.phone,
    status: requestBody.status,
    totalPrice: requestBody.totalPrice,
    user: requestBody.user
  });

  order = await order.save();

  if (!order) return res.status(400).send('This order cannot be created!');

  res.status(201).send(order);
});

module.exports.getSingleOrder = asyncMiddleware(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: {
        path: 'product',
        select: 'name description price',
        populate: {
          path: 'category',
          select: 'name'
        }
      }
    });

  if (order) return res.send(order);

  res.status(404).send({ success: false, message: 'Order not found!' });
});

//* Helper functions *//
const createOrderItems = async (requestBody) => {
  //* Combine all the promises together
  const orderItemsIds = Promise.all(
    requestBody.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product
      });

      newOrderItem = await newOrderItem.save();

      //* Return only the newOrderItem id.
      return newOrderItem._id;
    })
  );

  return orderItemsIds;
};
