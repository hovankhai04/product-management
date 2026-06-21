const Cart = require('../../models/cart.model');

const Product = require('../../models/product.model');

const productHelper = require('../../helpers/product.js');

const Order = require('../../models/order.model');

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId
      }).select("title thumbnail price slug discountPercentage");

      productInfo.priceNew = productHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = item.quantity * item.productInfo.priceNew;
    }
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);


  res.render("client/pages/checkout/index", {
    pageTitle: 'Thanh toán',
    cartDetail: cart
  })
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cardId = req.cookies.cartId;
  const userInfo = req.body;

  const cart = await Cart.findOne(
    {
      _id: cardId
    }
  );

  const products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      quantity: product.quantity,
      price: 0,
      discountPercentage: 0
    }

    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cardId,
    userInfo: userInfo,
    products: products
  };

  const order = new Order(orderInfo);
  order.save();

  await Cart.updateOne({
    _id: cardId
  }, {
    products: [],
  })


  res.redirect(`/checkout/success/${order.id}`)
}

// [GET] /success/:orderId
module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productHelper.priceNewProduct(product);

    product.totalPrice = product.quantity * product.priceNew;
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/success", {
    pageTitle: 'Đơn hàng thành công',
    order: order
  })
}