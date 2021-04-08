/**
 * * Product Model.
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  richDescription: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  images: [
    {
      type: String
    }
  ],
  brand: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  rating: {
    type: Number,
    min: 0,
    default: 0
  },
  numReviews: {
    type: Number,
    min: 0,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

//? Get id without underscore (_id) ==> id
productSchema.virtual('id').get(function () {
  return this._id.toHexString();
})

productSchema.set('toJSON', {
  virtuals: true
});


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
