/* eslint-disable no-async-promise-executor */
/**
 * * User Model.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
		default: ''
	},
	phone: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	street: {
		type: String,
		default: ''
	},
	apartment: {
		type: String,
		default: ''
	},
	zip: {
		type: String,
		default: ''
	},
	city: {
		type: String,
		default: ''
	},
	country: {
		type: String,
		default: ''
	}
});

userSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

userSchema.set('toJSON', {
	virtuals: true
});

//? This method will be called before the user saved.
userSchema.pre('save', async function (next) {
	// * this => gives us access to individual user
	const user = this;

	//? Check first, if the password changed (became a plain text) or it's already hashed
	if (user.isModified('password')) {
		//* The second argument is the number of rounds we wanna perform => how many times the hashing algorithm is executed
		//* 8 => is the value which recommended by the original creator of the bcrypt algorithm
		const salt = await bcrypt.genSalt(8);
		user.password = await bcrypt.hash(user.password, salt);
	}
	next();
});

//TODO: Create a new method on the User Model (Model method)

/**
 * ? Check if the user exist or not ?
 */
userSchema.statics.findByCredentials = async (email, password) => {
	return new Promise(async (resolve) => {
		const user = await User.findOne({ email });

		if (!user) return resolve({ error: 'Invalid email or password!' });

		//? Check if the password matches or not
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return resolve({ error: 'Invalid email or password!' });

		//* if everything is ok, return the user
		resolve({ user });
	});
};

//TODO: Create a new method on the user object (Instance method)

/**
 * ? Generate authentication token
 */
userSchema.methods.generateAuthToken = async function () {
	const token = jwt.sign(
		{
			userId: this.id,
			isAdmin: this.isAdmin
		},

		process.env.JWT_SECRET,

		{
			expiresIn: '10 minutes'
		}
	);

	return token;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
module.exports = User;
