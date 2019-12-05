let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let ObjectID = require('mongoose').Types.ObjectId;
let { upload } = require('../middleware/multer');

const redirectToHome = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('home');
  }
  next();


}

route.route('/add-product')
  .get(redirectToHome, (req, res) => {
    return res.render('add-product', { success: true });
  })
  .post(upload.array('image', 2), async (req, res) => {
    let { productID, name, origin, discount, inStock, price, description, } = req.body;
    let image = req.files;
    // let product = await PRODUCT_MODEL.findOne({ productID: productID });

    // if (productID)
    //   return res.render('add-product', { message: 'Product_exist', success: false });
    // else {
    let product = await PRODUCT_MODEL.create(req.body);

    return res.redirect('/product');
    // }


  });


route.get('/home', (req, res) => {
  if (req.session.user)
    return res.render('home', { user: req.session.user });
  return res.render('home', { user: null });
});

route.get('/product', async (req, res) => {
  let listProduct = await PRODUCT_MODEL.find({});


  if (req.session.user)
    return res.render('product', { user: req.session.user, listProduct });
  return res.render('product', { user: null, listProduct });
});

exports.PRODUCT_ROUTE = route;