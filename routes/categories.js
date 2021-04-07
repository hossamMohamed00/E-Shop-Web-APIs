/**
 * * Category routes.
 */
const express = require('express');
const categoryController = require('../controller/category');

const router = express.Router();

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getSingleCategory);

router.post('/', categoryController.createCategory);

router.put('/:id', categoryController.updateCategory);

router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
