let express = require('express');
let route = express.Router();
let { USER_MODEL } = require('../models/user');
let { CATEGORY_MODEL } = require('../models/category');
let ObjectID = require('mongoose').Types.ObjectId;


const redirectToHome = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('home');
  }
  next();


}

route.route('/register')
  .get(redirectToHome, (req, res) => {
    return res.render('user/register', { success: true });
  })
  .post(async (req, res) => {
    let { email, password, confirm_password, username } = req.body;
    let user = await USER_MODEL.findOne({ email: email });

    if (user)
      return res.render('user/register', { message: 'User_exist', success: false });
    else if (password !== confirm_password) {
      return res.render('user/register', { message: 'Password does not match', success: false });
    }
    else {
      let user = await USER_MODEL.create(req.body);
      if (!user)
        res.json({ success: false, message: 'cannot_register' });
      req.session.user = user;

      return res.redirect('/home');


    }


  })
route.route('/login', redirectToHome)
  .get((req, res) => {

    res.render('user/login', { success: true, message: 'user_not_exist' });
  })
  .post(async (req, res) => {
    let { email, password } = req.body;
    let user = await USER_MODEL.findOne({ email });

    if (!user)
      return res.render('user/login', { success: false, message: 'user_not_exist' });
    else if (password !== user.password)
      return res.render('user/login', { success: false, message: 'Wrong password' });

    req.session.user = user;

    res.redirect('/home');
  });

route.get('/home', async (req, res) => {
  let category = await CATEGORY_MODEL.find({});

  if (req.session.user)
    return res.render('home', { user: req.session.user, category });
  return res.render('home', { user: null, category });
});

route.post('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/home');
});

route.get('/about-us', (req, res) => {
  if (req.session.user)
    return res.render('about-us', { user: req.session.user });
  return res.render('about-us', { user: null });


})





exports.USER_ROUTE = route;