const Product = require('../models/product');
const Category = require('../models/category');
const asyncMiddleware = require('../middleware/async');

module.exports.createProduct = asyncMiddleware(async (req, res, ) => {
	const bodyData = req.body;

	//? validate the category id
	const category = await Category.findById(bodyData.category);

	if (!category)
		return res
			.status(400)
			.send({ success: false, message: 'Invalid category id!' });

	//? validate the product image
	const file = req.file;
	if (!file)
		return res
			.status(400)
			.send({ success: false, message: 'You must upload product image!' });

	let product = new Product({
		name: bodyData.name,
		description: bodyData.description,
		richDescription: bodyData.richDescription,
		image: file.filenameOnDB,
		brand: bodyData.brand,
		price: bodyData.price,
		category: bodyData.category,
		countInStock: bodyData.countInStock,
		rating: bodyData.rating,
		numReviews: bodyData.numReviews,
		isFeatured: bodyData.isFeatured
	});

	product = await product.save();

	if (!product)
		return res
			.status(500)
			.send({ success: false, message: 'This product cannot be created!' });

	//* If all is ok, inform the user
	res.status(201).json(product);
});

module.exports.getProducts = asyncMiddleware(async (req, res, ) => {
	//? Filter the column to return
	const selectStatement = filterColumn(req.query);

	//? Filter by the categories
	const filter = categoriesFilter(req.query);

	//? Find the products
	const productList = await Product.find(filter)
		.select(selectStatement)
		.populate('category');

	res.send(productList);
});

module.exports.getSingleProduct = asyncMiddleware(async (req, res, ) => {
	//? Filter the column to return
	let selectStatement = filterColumn(req.query);
	const product = await Product.findById(req.params.id)
		.select(selectStatement)
		.populate('category');

	if (!product)
		res.status(404).json({ success: false, message: 'Product not found!' });

	return res.send(product);
});

module.exports.getProductCount = asyncMiddleware(async (req, res, ) => {
	const productCount = await Product.countDocuments((count) => count);
	if (!productCount)
		return res
			.status(500)
			.send({ success: false, message: 'No products count!' });

	res.send({ productCount });
});

module.exports.getFeaturedProducts = asyncMiddleware(async (req, res, ) => {
	//? Filter the column to return
	const selectStatement = filterColumn(req.query);

	//? Check for limit
	const limit = getLimit(req.query);

	//* Find the products
	const productList = await Product.find({ isFeatured: true })
		.limit(limit)
		.select(selectStatement);

	if (!productList)
		return res
			.status(404)
			.json({ success: false, message: 'No Featured Products' });

	res.send(productList);
});

module.exports.updateProduct = asyncMiddleware(async (req, res, ) => {
	const bodyData = req.body;
	//? validate the category id
	const category = await Category.findById(bodyData.category);

	if (!category)
		return res
			.status(400)
			.send({ success: false, message: 'Invalid category id!' });

	//? validate the product image
	const file = req.file;
	if (!file)
		return res
			.status(400)
			.send({ success: false, message: 'You must upload product image!' });

	//* Update the product
	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{
			name: bodyData.name,
			description: bodyData.description,
			richDescription: bodyData.richDescription,
			image: file.filenameOnDB,
			brand: bodyData.brand,
			price: bodyData.price,
			category: bodyData.category,
			countInStock: bodyData.countInStock,
			rating: bodyData.rating,
			numReviews: bodyData.numReviews,
			isFeatured: bodyData.isFeatured
		},
		{ new: true }
	);

	if (!product)
		return res
			.status(404)
			.send({ success: false, message: 'Product not found!' });

	return res.send(product);
});

module.exports.uploadGalleryImages = asyncMiddleware(async (req, res, ) => {
	//* Get the images paths
	let imagePaths = [];
	const files = req.files;

	if (files) {
		files.map((file) => {
			imagePaths.push(file.filenameOnDB);
		});
	} else {
		return res
			.status(400)
			.send({ success: false, message: 'You must upload product image!' });
	}

	//* Update the product
	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{
			images: imagePaths
		},
		{ new: true }
	);

	if (!product)
		return res
			.status(404)
			.send({ success: false, message: 'Product not found!' });

	return res.send({
		success: true,
		message: 'Product Gallery Images successfully uploaded!'
	});
});

module.exports.deleteProduct = asyncMiddleware(async (req, res, ) => {
	const product = await Product.findByIdAndRemove(req.params.id);

	if (!product)
		return res
			.status(404)
			.send({ success: false, message: 'No product with that id exists!' });

	return res.send({ success: true, message: 'The product is deleted!' });
});

/*------Helper functions----------*/

const filterColumn = (queryParams) => {
	let selectStatement = '';

	if (queryParams.returnOnly) {
		let params = queryParams.returnOnly;
		params = params.split(',');
		params.forEach((param) => {
			selectStatement += `${param} `;
		});
	}

	return selectStatement;
};

const getLimit = (queryParams) =>
	queryParams.limit ? parseInt(queryParams.limit) : 0;

const categoriesFilter = (queryParams) => {
	let categoriesFilter = {};
	if (queryParams.categories) {
		categoriesFilter = { category: queryParams.categories.split(',') };
	}
	return categoriesFilter;
};
