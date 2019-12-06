let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let imageSchema = new Schema({
  image: String,
  ID: {
    type: String,
    require: true,
    unique: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }

});

let ImageModel = mongoose.model('image', imageSchema);

exports.IMAGE_MODEL = ImageModel;