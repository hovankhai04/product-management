const systemConfig = require('../../configs/system');

module.exports.createPost = async (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", "Vui lòng chọn tiêu đề");
    res.redirect(`${systemConfig.prefixAdmin}/products/create`);
    return;
  }
  next();
}