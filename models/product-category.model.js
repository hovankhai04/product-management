const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);


const productCategorySchema = new mongoose.Schema({
  title: String,
  parent_id: {
    type: String,
    default: "",
    ref: "ProductCategory"
  },
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true // tạo các field createdAt, updatedAt khi tạo mới sản phẩm
  });

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, 'products-category'); // tên Model/schema/collection

module.exports = ProductCategory;