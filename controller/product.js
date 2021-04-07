const Product = require('../models/product');
const asyncMiddleware = require('../middleware/async');

module.exports.createProduct = asyncMiddleware((req, res, next) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports.getProducts = asyncMiddleware(async (req, res, next) => {
  const productList = await Product.find();
  res.send(productList);
});
