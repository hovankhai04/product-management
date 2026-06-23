const User = require('../../models/user.model');

const systemConfig = require('../../configs/system');

const md5 = require('md5');

const generateHelper = require('../../helpers/generate');

const ForgotPassword = require('../../models/forgot-password.model')

const sendMailHelper = require('../../helpers/sendMail');

const Cart = require('../../models/cart.model');

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

  const guestCart = await Cart.findOne({
    _id: req.cookies.cartId
  });

  const userCart = await Cart.findOne({
    user_id: user.id
  });

  if (userCart) {

    for (const guestProduct of guestCart.products) {

      const existProduct = userCart.products.find(
        item => item.product_id === guestProduct.product_id
      );

      if (existProduct) {
        existProduct.quantity += guestProduct.quantity;
      } else {
        userCart.products.push({
          product_id: guestProduct.product_id,
          quantity: guestProduct.quantity
        });
      }
    }

    await userCart.save();

    await Cart.deleteOne({
      _id: guestCart.id
    });

    res.cookie('cartId', userCart.id);

  } else {

    guestCart.user_id = user.id;

    await guestCart.save();

    res.cookie('cartId', guestCart.id);
  }

  res.cookie('tokenUser', user.tokenUser);

  res.redirect('/')
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie('tokenUser');

  const guestCart = new Cart();
  await guestCart.save();

  const expiresCookie = 365 * 24 * 60 * 60 * 1000;

  res.cookie('cartId', guestCart.id, {
    expires: new Date(Date.now() + expiresCookie)
  });

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

  // Nếu tồn tại thì gửi mã OTP qua email
  const subject = "Mã OTP xác minh lấy lại mật khẩu của bạn";
  const html = `
    Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng của mã là 3 phút.
  `;
  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email
  })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    req.flash('error', 'Mã OTP không đúng');
    res.redirect('/user/password/otp');
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.cookie('tokenUser', user.tokenUser);

  res.redirect("/user/password/reset");
}

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render('client/pages/user/reset-password', {
    pageTitle: 'Đổi mật khẩu'
  });
}

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne({ tokenUser: tokenUser }, { password: md5(password) });

  req.flash('success', 'Đổi mật khẩu thành công');
  res.redirect("/");

}

// [GET] /user/info
module.exports.info = async (req, res) => {
  res.render('client/pages/user/info', {
    pageTitle: 'Thông tin tài khoản'
  });
}