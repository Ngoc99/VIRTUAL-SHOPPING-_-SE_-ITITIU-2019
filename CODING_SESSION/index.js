let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let expressSession = require('express-session');

let { USER_ROUTE } = require('./route/user')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'DPQ',
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 10 * 60 * 1000 // milli
  }
}))

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', USER_ROUTE);

app.get('/', (req, res) => {
  res.json({ message: success });
});

let uri = `mongodb://localhost/Test`;

mongoose.connect(uri);
mongoose.connection.once('open', () => {
  console.log('mongodb connected');
  app.listen(3000, () => {
    console.log(`Server started at port 3000`);
  });

});
