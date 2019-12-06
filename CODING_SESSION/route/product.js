let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let ObjectID = require('mongoose').Types.ObjectId;
let { upload } = require('../middleware/multer');
let { IMAGE_MODEL } = require('../models/productImage');

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
  .post(upload.single('image'), async (req, res) => {
    let { productID, name, origin, discount, inStock, price, description } = req.body;
    let image = new IMAGE_MODEL({
      image: req.file.path,
      ID: req.body.ID = productID
    });
    let productExist = await PRODUCT_MODEL.findOne({ productID: productID });

    if (productExist)
      return res.render('add-product', { message: 'Product_exist', success: false });
    else if (req.file.fieldname == undefined) {
      res.render('add-product', { message: 'Error:No File Selected' });
    }
    else {
      let product = await PRODUCT_MODEL.create(req.body);
      let productImage = await IMAGE_MODEL.create(image, ID);
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
  let { productID } = req.body;
  let image = await IMAGE_MODEL.find({});

  let selectedImage = image.map(image => {
    return image.ID = productID;
  });
  console.log({ image: image });

  if (req.session.user)
    return res.render('product', { user: req.session.user, listProduct, selectedImage });
  return res.render('product', { user: null, listProduct, selectedImage });
});

exports.PRODUCT_ROUTE = route;