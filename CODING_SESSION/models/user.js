let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: {
    type: String,
    require: true,
    trim: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  createAt: {
    type: Date,
    default: Date.now
  }

});

let UserModel = mongoose.model('user', userSchema);

exports.USER_MODEL = UserModel;