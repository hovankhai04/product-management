const ProductCategory = require('../../models/product-category.model');

const createTreeHelper = require('../../helpers/createTree');

const systemConfig = require('../../configs/system');
// GET /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render('admin/pages/products-category/index', {
    pageTitle: 'Danh mục sản phẩm',
    records: newRecords
  });
}

// GET /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render('admin/pages/products-category/create', {
    pageTitle: 'Tạo danh mục sản phẩm',
    records: newRecords
  });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  }
  else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body); // tạo mới một sản phẩm mới nhưng chưa lưu vào database
  await record.save(); // lưu vào database

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}