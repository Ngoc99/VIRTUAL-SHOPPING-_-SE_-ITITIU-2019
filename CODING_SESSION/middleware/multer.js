let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let outputPath = path.resolve(__dirname, '../public/upload/');
    console.log({ outputPath });
    cb(null, outputPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
});

let upload = multer({ storage: storage });

exports.upload = upload;