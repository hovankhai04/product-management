module.exports.registerPost = async (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', 'Vui lòng nhập họ tên');
    res.redirect("/user/register");
    return;
  }

  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect("/user/register");
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect("/user/register");
    return;
  }
  next();
};

module.exports.loginPost = async (req, res, next) => {

  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect("/user/login");
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Vui lòng nhập mật khẩu');
    res.redirect("/user/login");
    return;
  }
  next();
};

module.exports.forgotPasswordPost = async (req, res, next) => {

  if (!req.body.email) {
    req.flash('error', 'Vui lòng nhập email');
    res.redirect("/user/password/forgot");
    return;
  }

  next();
};