/**
 * * Order routes.
 */
const express = require('express');
const orderController = require('../controller/order');

const router = express.Router();

router.post('/', orderController.createOrder);

router.get('/', orderController.getOrders);

router.get('/:id', orderController.getSingleOrder);

router.get('/get/userorders/:userid', orderController.getUserOrders);

router.get('/get/totalsales', orderController.getTotalSales);

router.get('/get/count', orderController.getOrderCount);

router.put('/:id', orderController.updateOrderStatus);

router.delete('/:id', orderController.deleteOrder);



module.exports = router;
