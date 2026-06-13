const Product = require('../../models/product.model');

const ProductCategory = require('../../models/product-category.model');

const ProductHelper = require('../../helpers/product.js');

const ProductsCategoryHelper = require('../../helpers/products-category.js');

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
      slug: req.params.slugProduct,
      status: "active"
    }

    const product = await Product.findOne(find);

    if (product.product_category_id) {
      const category = await ProductCategory.findOne({
        _id: product.product_category_id,
        deleted: false,
        status: "active"
      });

      product.category = category;
    }

    product.priceNew = ProductHelper.priceNewProduct(product);

    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy sản phẩm này!");
    res.redirect(`/products`);
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false,
    status: "active"
  })

  if (!category) {
    req.flash("error", "Danh mục không tồn tại!");
    return res.redirect("/products");
  }

  const listSubCategory = await ProductsCategoryHelper.getSubCategory(category.id);

  const listSubCategoryId = listSubCategory.map(item => item.id)

  const products = await Product.find({
    deleted: false,
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
  }).sort({ position: "desc" });

  const newProducts = ProductHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts
  });
};

