let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let expressSession = require('express-session');
let { upload } = require('./middleware/multer');
let path = require('path');
let outputPath = path.resolve(__dirname, '../public/upload');




// let fileUpload = require('express-fileupload');

let { USER_ROUTE } = require('./route/user');
let { PRODUCT_ROUTE } = require('./route/product');
let { CATEGORY_ROUTE } = require('./route/category');
let { CART_ROUTE } = require('./route/cart');




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'DPQ',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 10 * 60 * 1000 // milli
  }
}));

app.set('view engine', 'ejs');
app.set('views', './views');



// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(fileUpload());

app.use('/', USER_ROUTE);
app.use('/', PRODUCT_ROUTE);
app.use('/', CATEGORY_ROUTE);
app.use('/', CART_ROUTE);



app.get('/', (req, res) => {
  res.json({ message: 'success' });
});


let uri = `mongodb://localhost/Test`;

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('mongodb connected');
  app.listen(3000, () => {
    console.log(`Server started at port 3000`);
  });

});