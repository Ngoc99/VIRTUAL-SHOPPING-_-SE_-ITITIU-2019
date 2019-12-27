let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let { CATEGORY_MODEL } = require('../models/category');
let ObjectID = require('mongoose').Types.ObjectId;
let { upload } = require('../middleware/multer');

route.route('/cart')
  .get((req, res) => {
    if (req.session.user)
      return res.render('product/cart', { user: req.session.user, success: true });
    return res.render('product/cart', { user: null, success: true });
  })
  .post(async (req, res) => {

  });



exports.CART_ROUTE = route;