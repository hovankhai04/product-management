const User = require('../../models/user.model');

const systemConfig = require('../../configs/system');

const md5 = require('md5');

const generateHelper = require('../../helpers/generate');

const ForgotPassword = require('../../models/forgot-password.model')

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

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render('client/pages/user/forgot-password', {
    pageTitle: 'Lấy lại mật khẩu'
  });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false
  });

  if (!user) {
    req.flash('error', 'Email không tồn tại')
    res.redirect("/user/password/forgot")
    return;
  }

  // lưu thông tin vào otp
  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now()
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword)
  await forgotPassword.save();

  // Nếu tồn tại thì gửi mã OTP qua email  (viết sau)

  res.send('ok')
}