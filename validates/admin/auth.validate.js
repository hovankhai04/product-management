const systemConfig = require('../../configs/system');

module.exports.loginPost = async (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  next();
};