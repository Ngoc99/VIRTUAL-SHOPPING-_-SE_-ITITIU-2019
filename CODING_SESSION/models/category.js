let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
  title: {
    type: String,
    require: true,
    unique: true
  },
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: 'product'
    }
  ]
});

let CategoryModel = mongoose.model('category', categorySchema);

exports.CATEGORY_MODEL = CategoryModel;