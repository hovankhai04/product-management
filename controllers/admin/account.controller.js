const Account = require('../../models/accounts.model');

const Role = require('../../models/role.model');

const systemConfig = require('../../configs/system');
const md5 = require('md5');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select('-password -token').populate("role_id", "title");

  res.render('admin/pages/accounts/index', {
    pageTitle: 'Danh sách tài khoản',
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });

  res.render('admin/pages/accounts/create', {
    pageTitle: 'Tạo mới tài khoản',
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash('error', `Email ${req.body.email} đã tồn tại`);
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
  } else {
    req.body.password = md5(req.body.password);
    const records = new Account(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  const find = {
    _id: req.params.id,
    deleted: false,
  }

  const record = await Account.findOne(find);

  const roles = await Role.find({
    deleted: false,
  });

  res.render('admin/pages/accounts/edit', {
    pageTitle: 'Chỉnh sửa tài khoản',
    roles: roles,
    record: record,
  });
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash('error', `Email ${req.body.email} đã tồn tại`);
  }
  else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    }
    else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash('success', 'Cập nhật thành công');
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${id}`);
};

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;

    // await Product.deleteOne({ _id: id });
    await Account.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });
    req.flash("success", `Đã xóa sản phẩm thành công!`);
  } catch (error) {
    console.error(error);
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};


// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const account = await Account.findOne(find).select('-password -token').populate("role_id", "title");


    res.render("admin/pages/accounts/detail", {
      pageTitle: "Trang chi tiết tài khoản",
      account: account,

    });
  } catch (error) {
    req.flash("error", "Không tìm thấy tài khoản này!");
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}