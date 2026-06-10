const Product = require('../../models/product.model');

const ProductHelper = require('../../helpers/product.js');

// [GET] /
module.exports.index = async (req, res) => {
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6);

  const newProducts = ProductHelper.priceNewProducts(productsFeatured);

  // Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: 'active'
  }).limit(6).sort({ position: "desc" });

  const newProductsNew = ProductHelper.priceNewProducts(productsNew);
  res.render('client/pages/home/index', {
    pageTitle: 'Trang chủ',
    productsFeatured: newProducts,
    productsNew: newProductsNew
  });
};