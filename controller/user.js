const User = require('../models/user');
const asyncMiddleware = require('../middleware/async');

module.exports.registerUser = asyncMiddleware(async (req, res, ) => {
	const bodyData = req.body;

	//? validate the user avatar
	let filenameOnDB = '';
	if (req.file) filenameOnDB = req.file.filenameOnDB;

	let user = new User({
		name: bodyData.name,
		email: bodyData.email,
		password: bodyData.password, // The password will be stored as hashed password (check pre method on user model)
		avatar: filenameOnDB,
		phone: bodyData.phone,
		isAdmin: bodyData.isAdmin,
		street: bodyData.street,
		apartment: bodyData.apartment,
		zip: bodyData.zip,
		city: bodyData.city,
		country: bodyData.country
	});

	user = await user.save();

	if (!user)
		return res
			.status(500)
			.send({ success: false, message: 'The user cannot be created!' });

	res.status(201).send(user);
});

module.exports.login = asyncMiddleware(async (req, res, ) => {
	const { error, user } = await User.findByCredentials(
		req.body.email,
		req.body.password
	);

	//? If error exists ?
	if (error) return res.status(400).send(error);

	//Todo: Generate Authentication Token
	const token = await user.generateAuthToken();

	//* If everything is ok
	res.send({ user: user.email, token });
});

module.exports.getUsers = asyncMiddleware(async (req, res, ) => {
	const usersList = await User.find().select('-password -__v');
	res.send(usersList);
});

module.exports.getSingleUser = asyncMiddleware(async (req, res, ) => {
	const user = await User.findById(req.params.id).select('-password -__v');

	if (!user)
		return res.status(404).send({ success: false, message: 'User not found!' });

	res.status(200).send(user);
});

module.exports.getUserCount = asyncMiddleware(async (req, res, ) => {
	const userCount = await User.countDocuments((count) => count);
	if (!userCount)
		return res
			.status(500)
			.send({ success: false, message: 'No products count!' });

	res.send({ userCount });
});

module.exports.deleteUser = asyncMiddleware(async (req, res, ) => {
	const user = await User.findByIdAndRemove(req.params.id);

	if (!user)
		return res
			.status(404)
			.send({ success: false, message: 'No user with that id exists!' });

	return res.send({ success: true, message: 'The user is deleted!' });
});