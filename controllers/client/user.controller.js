const User = require('../../models/user.model');

const systemConfig = require('../../configs/system');

const md5 = require('md5');


// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render('client/pages/user/register', {
    pageTitle: 'Đăng ký tài khoản'
  });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {

  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    req.flash('error', 'Email đã tồn tại');
    res.redirect('/user/register');
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie('tokenUser', user.tokenUser);

  res.redirect('/')
}

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render('client/pages/user/login', {
    pageTitle: 'Đăng nhập'
  });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });

  if (!user) {
    req.flash('error', 'Email không tồn tại');
    res.redirect('/user/login');
    return;
  }

  if (md5(password) !== user.password) {
    req.flash('error', 'Mật khẩu không đúng');
    res.redirect('/user/login');
    return;
  }

  if (user.status == "inactive") {
    req.flash('error', 'Tài khoản đã bị khóa');
    res.redirect('/user/login');
    return;
  }
  res.cookie('tokenUser', user.tokenUser);

  res.redirect('/')
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser');
  res.redirect('/')
}