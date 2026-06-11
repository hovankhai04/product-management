const Product = require('../../models/product.model');

const ProductHelper = require('../../helpers/product.js');

// [GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;

  let newProducts = [];

  if (keyword) {
    const regex = new RegExp(keyword, 'i');
    products = await Product.find({
      deleted: false,
      status: "active",
      title: regex
    });

    newProducts = ProductHelper.priceNewProducts(products);
  }

  res.render('client/pages/search/index', {
    pageTitle: 'Kết quả tìm kiếm',
    keyword: keyword,
    products: newProducts
  });
}