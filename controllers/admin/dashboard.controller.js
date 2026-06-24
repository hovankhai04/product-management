const ProductCategory = require('../../models/product-category.model');

const Product = require('../../models/product.model');

const Account = require('../../models/accounts.model');

const User = require('../../models/user.model');

const statisticHelper = require('../../helpers/statistic');

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {};

  statistic.categoryProduct = await statisticHelper.getStatistic(ProductCategory);

  statistic.product = await statisticHelper.getStatistic(Product);

  statistic.account = await statisticHelper.getStatistic(Account);

  statistic.user = await statisticHelper.getStatistic(User);


  res.render('admin/pages/dashboard/index', {
    pageTitle: 'Trang tổng quan',
    statistic: statistic
  });
};