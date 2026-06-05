const systemConfig = require('../../configs/system');

module.exports.createPost = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', 'Vui lòng nhập họ tên');
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    return;
  }

  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect(`${systemConfig.prefixAdmin}/accounts/create`);
    return;
  }
  next();
};
