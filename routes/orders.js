/**
 * * Order routes.
 */
const express = require('express');
const orderController = require('../controller/order');

const router = express.Router();

router.post('/', orderController.createOrder);

router.get('/', orderController.getOrders);

router.get('/:id', orderController.getSingleOrder);


module.exports = router;
