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
  .get((req, res) => {
    if (req.session.user)
      return res.render('add-product', { user: req.session.user, success: true });

    return res.render('add-product', { user: null, success: true });
  })
  .post(upload.array('image', 2), async (req, res) => {
    let { productID } = req.body;
    console.log(req.files);
    let newProduct = new PRODUCT_MODEL({
      image1: 'http://localhost:3000/upload/' + req.files[0].filename,
      image2: 'http://localhost:3000/upload/' + req.files[1].filename,
      productID: req.body.productID,
      name: req.body.name,
      origin: req.body.origin,
      discount: req.body.discount,
      inStock: req.body.inStock,
      price: req.body.price,
      description: req.body.description
    });


    let productExist = await PRODUCT_MODEL.findOne({ productID: productID });


    if (productExist)
      return res.render('add-product', { message: 'Product_exist', success: false });
    else if (req.files[0].filename == undefined) {
      res.render('add-product', { message: 'Error:No File Selected' });
    }

    else {
      let product = await PRODUCT_MODEL.create(newProduct);
      return res.redirect('/product');
    }





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

route.route('/productInfo')
  .get(async (req, res) => {
    let product = await PRODUCT_MODEL.findOne({});

    if (req.session.user)
      return res.render('productInfo', { user: req.session.user, product });
    return res.render('productInfo', { user: null, product });
  })
  .post(async (req, res) => {

  })

exports.PRODUCT_ROUTE = route;