const Order = require('../models/order');
const OrderItem = require('../models/orderItem');
const asyncMiddleware = require('../middleware/async');

module.exports.getOrders = asyncMiddleware(async (req, res) => {
	const orderList = await Order.find()
		.select('orderItems status totalPrice user')
		.populate('user', 'name')
		.sort({ dateOrdered: -1 });
	res.send({
		success: true,
		ordersCount: orderList.length,
		orders: orderList
	});
});

module.exports.createOrder = asyncMiddleware(async (req, res) => {
	const requestBody = req.body;

	//* Create order item first
	const orderItemsIds = await createOrderItems(requestBody);

	//*Calculate total price
	const orderTotalPrices = await calculateTotalPrice(orderItemsIds);
	// Combine all totalPrices
	const totalPrice = orderTotalPrices.reduce((a, b) => a + b, 0);

	let order = new Order({
		orderItems: orderItemsIds,
		shippingAddress1: requestBody.shippingAddress1,
		shippingAddress2: requestBody.shippingAddress2,
		city: requestBody.city,
		zip: requestBody.zip,
		country: requestBody.country,
		phone: requestBody.phone,
		status: requestBody.status,
		totalPrice: totalPrice,
		user: requestBody.user
	});

	order = await order.save();

	if (!order) return res.status(400).send('This order cannot be created!');

	res.status(201).send(order);
});

module.exports.getSingleOrder = asyncMiddleware(async (req, res, ) => {
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

	if (order) return res.send({ success: true, order });

	res.status(404).send({ success: false, message: 'Order not found!' });
});

module.exports.getUserOrders = asyncMiddleware(async (req, res, ) => {
	const userOrderList = await Order.find({ user: req.params.id })
		.select('status totalPrice')
		.populate({
			path: 'orderItems',
			populate: {
				path: 'product',
				select: 'name price category',
				populate: { path: 'category', select: 'name' }
			}
		})
		.sort({ dateOrdered: -1 });

	if (userOrderList.length !== 0) {
		res.send({
			success: true,
			ordersCount: userOrderList.length,
			orders: userOrderList
		});
	} else {
		res.status(404).send({ success: false, message: 'No Orders found!' });
	}
});

module.exports.getTotalSales = asyncMiddleware(async (req, res, ) => {
	const totalSales = await Order.aggregate([
		{
			$group: { _id: null, totalSales: { $sum: '$totalPrice' } }
		}
	]);

	console.log(totalSales);
	if (!totalSales)
		return res
			.status(400)
			.send({ success: false, message: 'The order sales cannot be generated' });

	return res.send({ success: true, totalSales: totalSales.pop().totalSales });
});

module.exports.getOrderCount = asyncMiddleware(async (req, res, ) => {
	const orderCount = await Order.countDocuments((count) => count);
	if (!orderCount)
		return res.status(500).send({ success: false, message: 'No order count!' });

	res.send({ success: true, orderCount: orderCount });
});

module.exports.updateOrderStatus = asyncMiddleware(async (req, res, ) => {
	let order = await Order.findByIdAndUpdate(
		req.params.id,
		{
			status: req.body.status
		},
		{ new: true }
	);

	if (!order)
		return res
			.status(404)
			.send({ success: false, message: 'Order not found!' });

	return res.send(order);
});

module.exports.deleteOrder = asyncMiddleware(async (req, res, ) => {
	//? Remove the order
	const order = await Order.findByIdAndRemove({ _id: req.params.id });

	//? Remove order items also
	if (order) {
		await order.orderItems.map(async (orderItem) => {
			await OrderItem.findByIdAndRemove(orderItem);
		});

		return res.send({ success: true, message: 'the order is deleted!' });
	} else {
		return res
			.status(404)
			.send({ success: false, message: 'No order with that id exists!' });
	}
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

const calculateTotalPrice = async (orderItemsIds) => {
	const orderTotalPrice = Promise.all(
		orderItemsIds.map(async (orderItemId) => {
			const orderItem = await OrderItem.findById(orderItemId).populate(
				'product',
				'price'
			);

			const totalPrice = orderItem.product.price * orderItem.quantity;

			return totalPrice;
		})
	);

	return orderTotalPrice;
};
