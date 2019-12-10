let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let { CART_MODEL } = require('../models/cart');
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
    let { user } = req.session;
    let { productID, discount } = req.body;
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
    console.log(newProduct);


    let productExist = await PRODUCT_MODEL.findOne({ productID: productID });

    // if (discount) {
    //   return res.render('sale', { discount, user, success: true });
    // }
    if (discount < 0 || discount > 1) {
      return res.render('add-product', { message: 'Discount must be in range [0,1]', success: false, user });
    }
    else if (productExist) {
      return res.render('add-product', { message: 'Product_exist', success: false, user });
    }
    // else if (!image1 || !image2) {
    //   res.render('add-product', { message: 'Error:No File Selected', success: false, user });
    // }

    else {
      let product = await PRODUCT_MODEL.create(newProduct);
      return res.redirect('/product');
    }





  });

// route.get('/sale', async (req, res) => {
//   let listProduct = await PRODUCT_MODEL.find({});

//   if (req.session.user)
//     return res.render('sale', { user: req.session.user, listProduct });
//   return res.render('sale', { user: null, listProduct });
// })


route.get('/home', (req, res) => {
  if (req.session.user)
    return res.render('home', { user: req.session.user });
  return res.render('home', { user: null });
});

route.route('/product')
  .get(async (req, res) => {
    let listProduct = await PRODUCT_MODEL.find({});

    if (req.session.user)
      return res.render('product', { user: req.session.user, listProduct });
    return res.render('product', { user: null, listProduct });
  })


route.route('/productInfo/:id')
  .get(async (req, res) => {
    try {
      let { id } = req.params;
      console.log(id);
      let product = await PRODUCT_MODEL.findOne({ productID: id });
      console.log('ákdjkasjdklasjd');
      console.log(product);
      if (req.session.user)
        return res.render('productInfo', { user: req.session.user, product });
      return res.render('productInfo', { user: null, product });
    } catch (error) {
      res.json({ error: true, message: error.message });
    }

  })
  .post(async (req, res) => {
    try {
      let { cartID, productID, name, origin, price, image1, totalQuantity, discount, tax, total, totalPay } = req.body;
      let product = new CART_MODEL({
        cartID, totalQuantity, discount, tax, total, totalPay, productList: {
          productID, name, origin, price, image1
        }
      });
      let cart = await product.save();

      res.render('addToCart', { product });

    } catch (error) {
      res.json({ error: true, message: error.message });
    }










  })

route.get('/addToCart', async (req, res, next) => {
  let listProduct = await CART_MODEL.find({});

  console.log(listProduct);
  if (req.session.user)
    return res.render('addToCart', { user: req.session.user, listProduct });
  return res.render('addToCart', { user: null, listProduct });



})


exports.PRODUCT_ROUTE = route;