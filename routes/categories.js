/**
 * * Category routes.
 */
const express = require('express');
const categoryController = require('../controller/category');
const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', categoryController.getCategories);

router.get('/:id', validateObjectId, categoryController.getSingleCategory);

router.post('/', categoryController.createCategory);

router.put('/:id', validateObjectId, categoryController.updateCategory);

router.delete('/:id', validateObjectId, categoryController.deleteCategory);

module.exports = router;
