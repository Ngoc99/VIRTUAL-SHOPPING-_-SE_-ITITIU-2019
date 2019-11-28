let express = require('express');
let app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.json({ message: 'Success' });
});

app.listen(3000, () => {
  console.log(`Server started at port 3000`);
});