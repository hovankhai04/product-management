const Product = require('../../models/product.model');

const ProductHelper = require('../../helpers/product.js');

// [GET] /products
module.exports.index = async (req, res) => {

  // Lấy ra sản phẩm nổi bật
  const products = await Product.find({
    deleted: false,
    status: 'active',
  }).sort({ position: "desc" }); // tìm kiếm tất cả các sản phẩm với status là active và deleted là false

  const newProducts = ProductHelper.priceNewProducts(products);

  // Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: 'active'
  }).limit(6).sort({ position: "desc" });

  const newProductsNew = ProductHelper.priceNewProducts(productsNew);

  res.render('client/pages/products/index', {
    pageTitle: 'Trang danh sách sản phẩm',
    products: newProducts,
    productsNew: newProductsNew,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    }

    const product = await Product.findOne(find);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm này!");
    res.redirect(`/products`);
  }
};