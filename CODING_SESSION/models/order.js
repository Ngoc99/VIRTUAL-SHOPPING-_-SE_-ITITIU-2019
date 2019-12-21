let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let orderSchema = new Schema({
  customer: {
    type: String,
    ref: 'user'
  },
  cart: {
    type: String,
    ref: 'product'
  },
  shipMethod: {
    type: String
  },
  shipFee: {
    type: String
  },
  total: {
    type: Number
  }
});

let OrderModel = mongoose.model('order', orderSchema);

exports.ORDER_MODEL = OrderModel;