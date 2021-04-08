/**
 * * Product route.
 */
const express = require('express');
const productController = require('../controller/product');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.post(`/`, productController.createProduct);

router.get('/', productController.getProducts);

router.get('/:id', validateObjectId, productController.getSingleProduct);

router.get('/get/count', productController.getProductCount);

router.get('/get/featured', productController.getFeaturedProducts);

router.put('/:id', validateObjectId, productController.updateProduct);

router.delete('/:id', validateObjectId, productController.deleteProduct);

module.exports = router;
;