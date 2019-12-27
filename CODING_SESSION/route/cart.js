let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let { CATEGORY_MODEL } = require('../models/category');
let { CART_MODEL } = require('../models/cart');
let ObjectID = require('mongoose').Types.ObjectId;
let { upload } = require('../middleware/multer');

route.route('/cart/:id')
  .get(async (req, res) => {
    let { id } = req.params;
    let listProduct = await PRODUCT_MODEL.find({}).sort({ _id: -1 });
    let product = await PRODUCT_MODEL.findOne({ _id: id });

    let { user } = req.session;
    let cart = await CART_MODEL.findOne({});
    req.session.cart = cart;

    let { cart: { _id: productInfo } } = req.session;

    let category = await CATEGORY_MODEL.find({});


    let cartUpdate = await CART_MODEL.findByIdAndUpdate(productInfo, {
      $addToSet: {
        productList: id
      }
    }
      , { new: true });
    let productCart = await PRODUCT_MODEL.findOneAndUpdate(id, {
      $addToSet: {
        cart: productInfo
      }
    }, { new: true });

    req.session.cartUpdate = cartUpdate;
    req.session.productCart = productCart;


    if (!user) {
      res.redirect('/login');
      let cartUpdate = await CART_MODEL.findByIdAndUpdate(productInfo, {
        $set: {
          productList: []
        }

      });
      let productCart = await PRODUCT_MODEL.findOneAndUpdate(id, {
        $set: {
          cart: []
        }
      });

    }
    console.log(cartUpdate);
    return res.render('product/addToCart', { user: req.session.user, category, quantity: cartUpdate.productList.length, title: null, listProduct, cart });

  })
  .post(async (req, res) => {
    // let { id } = req.params;
    // let { productList, quantityEach, totalQuantity, totalPrice } = req.body;
    // let newCart = new CART_MODEL({
    //   productList,
    //   quantityEach,
    //   totalQuantity,
    //   totalPay: totalPrice
    // });

    // let cart = await CART_MODEL.create(newCart);
    // console.log(cart);
  })
route.get('/cart/cartList/:id', async (req, res) => {
  let { id } = req.params;
  let cart = await CART_MODEL.findOne({ _id: id });
  let list = cart.productList;
  let productList = [];
  let i = 0;
  for (i; i < list.length; i++) {
    productList[i] = await PRODUCT_MODEL.findOne({ _id: list[i] });
  }
  let category = await CATEGORY_MODEL.find({});
  console.log('aksjdkasd');
  console.log(req.session);

  return res.render('product/cart', { user: req.session.user, productList, category, cart, ObjectID });
});



route.get('/deleteItemInCart/:id', async (req, res) => {
  let { id } = req.params;
  console.log(id);
  // let id = mongoose.Types.ObjectId(id);
  let productDeleted = await PRODUCT_MODEL.findById({ id });
  console.log(productDeleted);
  // let { cart: { _id: productInfo } } = req.session;
  let { cartUpdate: { _id: productInfo } } = req.session;
  let category = await CATEGORY_MODEL.find({});

  console.log('deletd');
  let deleteProductFromCart = await CART_MODEL.findByIdAndUpdate(productInfo, {
    $pull: {
      productList: id
    }
  }
  );
  let cartDeleted = await PRODUCT_MODEL.findOneAndUpdate(id, {
    $pull: {
      cart: productInfo
    }
  });
  // console.log(deleteProductFromCart);


  // console.log(cartUpdate);
  // return res.redirect('/cart/cartList/:id');
  // return res.render('product/cart', { user: req.session.user, category, quantity: cartUpdate.productList.length, title: null, listProduct, cart })
})




exports.CART_ROUTE = route;