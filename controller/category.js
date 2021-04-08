const Category = require('../models/category');
const asyncMiddleware = require('../middleware/async');

module.exports.createCategory = asyncMiddleware(async (req, res, next) => {
  let category = new Category({
    name: req.body.name,
    color: req.body.color,
    icon: req.body.icon
  });
  category = await category.save();

  if (!category)
    return res.status(500).send('This category cannot be created!');

  res.status(201).send(category);
});

module.exports.getCategories = asyncMiddleware(async (req, res, next) => {
  const categoriesList = await Category.find();
  res.send(categoriesList);
});

module.exports.getSingleCategory = asyncMiddleware(async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await Category.findById(categoryId);

  if (category) return res.send(category);

  res.status(404).send({ success: false, message: 'Category not found!' });
});

module.exports.updateCategory = asyncMiddleware(async (req, res, next) => {
  const categoryId = req.params.id;

  let category = await Category.findByIdAndUpdate(
    categoryId,
    {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon
    },
    { new: true }
  );

  if (category)
    return res
      .status(404)
      .send({ success: false, message: 'Category not found!' });

  return res.send(category);
});

module.exports.deleteCategory = asyncMiddleware(async (req, res, next) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (category)
    return res.send({ success: true, message: 'the category is deleted!' });

  return res
    .status(404)
    .send({ success: false, message: 'No category with that id exists!' });
});
