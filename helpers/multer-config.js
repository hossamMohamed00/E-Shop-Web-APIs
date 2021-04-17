/**
 * * In this file will be all multer config for file uploading
 */
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads');
	},
	filename: function (req, file, cb) {
		if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
			return cb(
				new Error('Please upload image with [png, jpeg, jpg] as file extension')
			);
		} else {
			//? if the file has the right extension
			//* Setup the file name
			const filenameSplitted = file.originalname.trim().split('.');
			const filename = `${filenameSplitted[0]}-${Date.now()}.${
				filenameSplitted[1]
			}`;

			//* Setup the file name on the database
			const basePath = `${req.protocol}://${req.get('host')}/${
				process.env.IMAGE_UPLOAD_PATH
			}`;
			const filenameOnDB = `${basePath}${filename}`;

			//* Set the filename on the database to the request
			file.filenameOnDB = filenameOnDB;

			//* Send the response
			cb(null, filename);
		}
	}
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1000000
	}
});

module.exports = upload;
