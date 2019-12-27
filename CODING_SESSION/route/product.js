let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let { CART_MODEL } = require('../models/cart');
let { CATEGORY_MODEL } = require('../models/category');
let ObjectID = require('mongoose').Types.ObjectId;
let { upload } = require('../middleware/multer');

const redirectToHome = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('home');
  }
  next();


}

route.route('/add-product')
  .get(async (req, res) => {
    let category = await CATEGORY_MODEL.find({});
    if (req.session.user)
      return res.render('product/add-product', { user: req.session.user, success: true, category });

    return res.render('product/add-product', { user: null, success: true, category });
  })
  .post(upload.array('image', 2), async (req, res) => {
    let { user } = req.session;
    let { productID, discount, category } = req.body;
    let newProduct = new PRODUCT_MODEL({
      image1: 'http://localhost:3000/upload/' + req.files[0].filename,
      image2: 'http://localhost:3000/upload/' + req.files[1].filename,
      productID: req.body.productID,
      name: req.body.name,
      origin: req.body.origin,
      discount: parseFloat(req.body.discount),
      inStock: req.body.inStock,
      price: parseFloat(req.body.price),
      description: req.body.description,
      category: req.body.category
    });


    let productExist = await PRODUCT_MODEL.findOne({ productID: productID });

    // if (discount) {
    //   return res.render('sale', { discount, user, success: true });
    // }
    if (discount < 0 || discount > 1) {
      return res.render('product/add-product', { message: 'Discount must be in range [0,1]', success: false, user, category });
    }

    else if (productExist) {
      return res.render('product/add-product', { message: 'Product_exist', success: false, user, category });
    }
    else if (!newProduct.image1 || !newProduct.image2) {
      res.render('add-product', { message: 'Error:No File Selected', success: false, user });
    }

    else {
      let product = await PRODUCT_MODEL.create(newProduct);
      return res.redirect('/product');
    }





  });

route.get('/deleteProduct/:id', async (req, res) => {
  let { id } = req.params;


  res.redirect('/product');


});

route.route('/updateProduct/:id')
  .get(async (req, res) => {
    let { id } = req.params;
    let category = await CATEGORY_MODEL.find({});
    let product = await PRODUCT_MODEL.findOne({ productID: id }, (err, pro) => {
      res.render('product/updateProduct', { pro, user: req.session.user, success: true, category });
    });


  })
  .post(async (req, res) => {
    let { id } = req.params;
    let updateProduct = {
      name: req.body,
      origin: req.body,
      price: req.body,
      discount: req.body,
      description: req.body,
      category: req.body,
    };
    product.update(id, updateProduct, (err) => {
      if (err) {
        res.render({ message: error });
      }
      else {
        res.redirect('/product');
      }
    })
  })












// route.get('/sale', async (req, res) => {
//   let listProduct = await PRODUCT_MODEL.find({ discount });
//   let category = await CATEGORY_MODEL.find({});

//   console.log(listProduct);

//   return res.render(`product`, { user: req.session.user, listProduct, title, category });
// })


route.route('/product')
  .get(async (req, res) => {
    let listProduct = await PRODUCT_MODEL.find({}).sort({ _id: -1 });
    let category = await CATEGORY_MODEL.find({});
    let newList = await PRODUCT_MODEL.find({})

    return res.render('product/product', { user: req.session.user, listProduct, title: null, category });
  });
route.route('/sale')
  .get(async (req, res) => {
    let listProduct = await PRODUCT_MODEL.find({});
    let category = await CATEGORY_MODEL.find({});
    // let listProduct = list.map(item => {
    //   item.discount;
    // })
    console.log(listProduct);

    return res.render('product/sale', { user: req.session.user, listProduct, title: null, category });
  })


route.route('/productInfo/:id')
  .get(async (req, res) => {
    try {
      let { id } = req.params;
      let product = await PRODUCT_MODEL.findOne({ productID: id });
      let cart = await CART_MODEL.find({});

      return res.render('product/productInfo', { user: req.session.user, product, cart });

    } catch (error) {
      res.json({ error: true, message: error.message });
    }

  })
  .post(async (req, res) => {
    // try {
    //   let { id } = req.params;
    //   let product = await PRODUCT_MODEL.findOne({ productID: id });
    //   let productList = await CART_MODEL.create(product);
    //   req.session.cart = cart;
    //   console.log(id);
    //   console.log(cart);
    //   return res.render('product/productInfo', { productList, cart, user: req.session });

    //   // listProduct.push(product);
    //   // console.log(listProduct);
    //   // if (cart) {
    //   //   listProduct.push(product);
    //   //   return res.render('cart', { listProduct, user: req.session });
    //   // }
    //   return res.render('product/cart', { product, user: req.session });


    // } catch (error) {
    //   res.json({ error: true, message: error.message });
    // }










  })



route.get('/:title', async (req, res) => {
  let { title } = req.params;
  let cart = await PRODUCT_MODEL.find();
  let listProduct = await PRODUCT_MODEL.find({ category: title });
  let category = await CATEGORY_MODEL.find({});

  if (title === 'cart') {
    return res.render('product/cart', { user: req.session.user, listProduct, title, category, cart });
  }
  else if (title === 'addToCart') {
    return res.render('product/addToCart', { user: req.session.user, listProduct, title, category });
  }
  else if (title === 'sale') {
    console.log(listProduct);
    return res.render('product/sale', { user: req.session.user, listProduct, title, category });
  }
  else if (title === 'order') {
    return res.render('product/order', { user: req.session.user, listProduct, title, category, success: true, cart });
  }
  else {
    return res.render('product/product', { user: req.session.user, listProduct, title, category });
  }

})


exports.PRODUCT_ROUTE = route;