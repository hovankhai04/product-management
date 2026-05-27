const Product = require('../../models/product.model');

const filterStatusHelper = require('../../helpers/filterStatus');

const searchHelper = require('../../helpers/search');

const paginationHelper = require('../../helpers/pagination');

const systemConfig = require('../../configs/system');

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // console.log(req.query.status);

  // Bộ lọc
  const filterStatus = filterStatusHelper(req.query);

  // console.log(req.query.status);
  let find = {
    deleted: false
  };
  // tìm kiếm theo status
  if (req.query.status) {
    find.status = req.query.status;
  };

  // tìm kiếm theo từ khoá
  const objectSearch = searchHelper(req.query);
  // console.log(objectSearch);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countProducts
  )
  // End Pagination

  // tìm kiếm theo điều kiện find
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // render view
  res.render('admin/pages/products/index', {
    pageTitle: 'Danh sách sản phẩm',
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });

};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    // console.log(req.params); // params chứa các thông số được truyền động vào url : status và id
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status });

    req.flash("success", 'Đã thay đổi trạng thái của sản phẩm thành công!');
    const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products`;
    res.redirect(backUrl);
  } catch (error) {
    console.error(error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => { // cài thêm thư viện body-parser và method-override
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Đã thay đổi trạng thái thành công cho ${ids.length} sản phẩm!`);
      break;

    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Đã thay đổi trạng thái thành công cho ${ids.length} sản phẩm!`);
      break;

    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
      req.flash("success", `Đã xoá thành công cho ${ids.length} sản phẩm!`);
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        // console.log(id);
        // console.log(position);

        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Đã đổi vị trí thành công ${ids.length} cho sản phẩm!`);
      break;

    default:
      break;
  }
  const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products`;
  res.redirect(backUrl);
}

// [PATCH] /admin/products/delete/:status/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await Product.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });
    req.flash("success", `Đã xóa sản phẩm thành công!`);
    const backUrl = req.get("Referer") || `${systemConfig.prefixAdmin}/products`;
    res.redirect(backUrl);
  } catch (error) {
    console.error(error);
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm sản phẩm"
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }
  else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body); // tạo mới một sản phẩm mới nhưng chưa lưu vào database
  await product.save(); // lưu vào database


  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const product = await Product.findOne(find);

    res.render("admin/pages/products/edit", {
      pageTitle: "Sửa sản phẩm",
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    }
    else {
      req.body.position = parseInt(req.body.position);
    }

    if (req.file) {
      req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", 'Đã cập nhật sản phẩm thành công!');
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm này!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}
