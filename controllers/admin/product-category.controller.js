const ProductCategory = require('../../models/product-category.model');

const createTreeHelper = require('../../helpers/createTree');

const systemConfig = require('../../configs/system');

// [GET] /admin/products-category
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

// [GET] /admin/products-category/create
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

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ProductCategory.findOne(
      {
        _id: id,
        deleted: false
      }
    )

    const records = await ProductCategory.find({
      deleted: false
    });

    const newRecords = createTreeHelper.tree(records);

    res.render('admin/pages/products-category/edit', {
      pageTitle: 'Sửa danh mục sản phẩm',
      data: data,
      records: newRecords
    });
  }
  catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({ _id: id }, req.body);

    req.flash("success", 'Đã cập nhật danh mục sản phẩm thành công!');

    res.redirect(`${systemConfig.prefixAdmin}/products-category/edit/${id}`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    req.flash("error", "Cập nhật danh mục sản phẩm thất bại!");
  }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await ProductCategory.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });
    req.flash("success", `Đã xóa sản phẩm thành công!`);
  } catch (error) {
    console.error(error);
  }

  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const productCategory = await ProductCategory.findOne(find);

    let parentCategory = null;
    if (productCategory.parent_id && productCategory.parent_id !== "") {
      parentCategory = await ProductCategory.findOne({
        _id: productCategory.parent_id,
        deleted: false
      });
    }


    res.render("admin/pages/products-category/detail", {
      pageTitle: productCategory.title,
      productCategory: productCategory,
      parentCategory: parentCategory

    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
}