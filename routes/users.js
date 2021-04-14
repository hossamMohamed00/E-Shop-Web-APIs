/**
 * * User routes.
 */
const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router.post('/register', userController.registerUser);

router.post('/login', userController.login);

router.get('/', userController.getUsers);

router.get('/:id', userController.getSingleUser);

router.get('/get/count', userController.getUserCount);

router.delete('/:id', userController.deleteUser);

module.exports = router;
