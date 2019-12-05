let express = require('express');
let route = express.Router();
let { PRODUCT_MODEL } = require('../models/product');
let ObjectID = require('mongoose').Types.ObjectId;

const redirectToHome = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('home');
  }
  next();


}

route.route('/register')
  .get(redirectToHome, (req, res) => {
    return res.render('register', { success: true });
  })
  .post(async (req, res) => {
    let { email, password, confirm_password, username } = req.body;
    let user = await USER_MODEL.findOne({ email: email });

    if (user)
      return res.render('register', { message: 'User_exist', success: false });
    else if (password !== confirm_password) {
      return res.render('register', { message: 'Password does not match', success: false });
    }
    else {
      let user = await USER_MODEL.create(req.body);

      req.session.user = user;

      return res.redirect('/home');

      if (!user)
        res.json({ success: false, message: 'cannot_register' });
    }


  })
route.route('/login', redirectToHome)
  .get((req, res) => {

    res.render('login', { success: true, message: 'user_not_exist' });
  })
  .post(async (req, res) => {
    let { email, password } = req.body;
    let user = await USER_MODEL.findOne({ email });

    if (!user)
      return res.render('login', { success: false, message: 'user_not_exist' });
    else if (password !== user.password)
      return res.render('login', { success: false, message: 'Wrong password' });

    req.session.user = user;

    res.redirect('/home');
  });

route.get('/home', (req, res) => {
  if (req.session.user)
    return res.render('home', { user: req.session.user });
  return res.render('home', { user: null });
});

route.get('/product', (req, res) => {
  if (req.session.user)
    return res.render('product', { user: req.session.user });
  return res.render('product', { user: null });
});

route.post('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/home');
});





exports.PRODUCT_ROUTE = route;