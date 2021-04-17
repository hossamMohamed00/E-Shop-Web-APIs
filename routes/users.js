/**
 * * User routes.
 */
const express = require('express');
const validateObjectId = require('../middleware/validateObjectId');
const multerUpload = require('../helpers/multer-config');
const userController = require('../controller/user');

const router = express.Router();

router.post(
	'/register',
	multerUpload.single('avatar'),
	userController.registerUser
);

router.post('/login', userController.login);

router.get('/', userController.getUsers);

router.get('/:id', validateObjectId, userController.getSingleUser);

router.get('/get/count', userController.getUserCount);

router.delete('/:id', validateObjectId, userController.deleteUser);

module.exports = router;
