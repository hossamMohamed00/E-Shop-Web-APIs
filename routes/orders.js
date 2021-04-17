/**
 * * Order routes.
 */
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const orderController = require('../controller/order');

const router = express.Router();

router.post('/', orderController.createOrder);

router.get('/', orderController.getOrders);

router.get('/:id', validateObjectId, orderController.getSingleOrder);

router.get(
	'/get/userorders/:id',
	validateObjectId,
	orderController.getUserOrders
);

router.get('/get/totalsales', orderController.getTotalSales);

router.get('/get/count', orderController.getOrderCount);

router.put('/:id', validateObjectId, orderController.updateOrderStatus);

router.delete('/:id', validateObjectId, orderController.deleteOrder);



module.exports = router;
