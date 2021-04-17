/**
 * * Product route.
 */
const express = require('express');
const productController = require('../controller/product');
const validateObjectId = require('../middleware/validateObjectId');
const multerUpload = require('../helpers/multer-config');

const router = express.Router();

router.post('/', multerUpload.single('image'), productController.createProduct);

router.get('/', productController.getProducts);

router.get('/:id', validateObjectId, productController.getSingleProduct);

router.get('/get/count', productController.getProductCount);

router.get('/get/featured', productController.getFeaturedProducts);

router.put(
	'/:id',
	validateObjectId,
	multerUpload.single('image'),
	productController.updateProduct
);

router.put(
	'/gallery-images/:id',
	validateObjectId,
	multerUpload.array('images', 10),
	productController.uploadGalleryImages
);

router.delete('/:id', validateObjectId, productController.deleteProduct);

module.exports = router;
