let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let { CATEGORY_MODEL } = require('../models/category');
let ObjectID = require('mongoose').Types.ObjectId;
let { upload } = require('../middleware/multer');

route.route('/addCategory')
  .get((req, res) => {
    if (req.session.user)
      return res.render('addCategory', { user: req.session.user, success: true });
    return res.render('addCategory', { user: null, success: true });
  })
  .post(async (req, res) => {
    let { title } = req.body;

    let newCategory = new CATEGORY_MODEL({
      title
    });

    let category = await CATEGORY_MODEL.create(newCategory);
    res.redirect('/home');
  });

route.get('/list-categories', async (req, res) => {
  try {
    let listCategory = await CATEGORY_MODEL.find({});
    res.json({ listCategory })
  } catch (error) {
    res.json({ error: true, message: error.message });
  }
});

exports.CATEGORY_ROUTE = route;