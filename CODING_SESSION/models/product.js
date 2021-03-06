let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let productSchema = new Schema({
  productID: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true,
    trim: true
  },
  origin: {
    type: String
  },
  discount: {
    type: String
  },
  inStock: {
    type: String
  },
  price: {
    type: String
  },
  description: {
    type: String
  },
  image1: String,
  image2: String,
  category: {
    type: String,
    ref: 'category'
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'cart'
  }],
  createAt: {
    type: Date,
    default: Date.now
  }

});

let ProductModel = mongoose.model('product', productSchema);

exports.PRODUCT_MODEL = ProductModel;
exports.productSchema = productSchema;