/**
 * * Validates the objectId
 */
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return res.status(400).send({
			success: false,
			kind: 'objectId',
			message: 'Invalid ObjectId has been provided'
		});
	}

	//* If everything is fine
	next();
};
