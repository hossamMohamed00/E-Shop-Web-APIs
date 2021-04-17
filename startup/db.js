const mongoose = require('mongoose');

const E_SHOP_DB = process.env.E_SHOP_DB;

module.exports = () => {
	mongoose
		.connect(E_SHOP_DB, {
			dbName: 'E_SHOP_DB',
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false, // because it's deprecated
		})
		.then(() => console.log(`Connected to ${E_SHOP_DB} successfully!`))
		.catch((err) => console.log(err));
};
