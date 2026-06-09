const Account = require('../../models/accounts.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../configs/system');

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } else {
    const user = await Account.findOne({ token: req.cookies.token }).select(" -password ");
    if (!user) {
      res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
      const role = await Role.findOne({
        _id: user.role_id
      }).select(" title permissions ");

      res.locals.role = role;
      res.locals.user = user;
      next();
    }
  }

}

module.exports.checkPermission = (permission) => {
  return (req, res, next) => {
    const permissions = res.locals.role?.permissions || [];

    if (!permissions.includes(permission)) {
      return res.status(403).send("Bạn không có quyền truy cập");
    }

    next();
  };
}