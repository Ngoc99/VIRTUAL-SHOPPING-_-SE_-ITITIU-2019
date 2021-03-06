let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let { productSchema } = require('./product')

let cartSchema = new Schema({

  productList: [{
    type: Schema.Types.ObjectId,
    ref: 'product'
  }],
  quantityEach: {
    type: String
  },
  totalQuantity: {
    type: String
  },
  discount: {
    type: String
  },
  tax: {
    type: String
  },
  total: {
    type: String
  },
  totalPay: String,
  createAt: {
    type: Date,
    default: Date.now
  }

});

let CartModel = mongoose.model('cart', cartSchema);



exports.CART_MODEL = CartModel;