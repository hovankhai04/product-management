const express = require('express');
const multer = require('multer');
const router = express.Router();

const validate = require('../../validates/admin/product-category.validate');

const upload = multer();

const controller = require('../../controllers/admin/product-category.controller');

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const PERMISSION = require('../../permissions/admin/admin.permission');

router.get(
  '/',
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.VIEW),
  controller.index
);

router.get(
  '/create',
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.CREATE),
  controller.create);

router.post(
  "/create",
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.CREATE),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get(
  '/edit/:id',
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.EDIT),
  controller.edit);

router.patch(
  '/edit/:id',
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.EDIT),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch);

router.delete(
  '/delete/:id',
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.DELETE),
  controller.deleteItem);

router.get(
  "/detail/:id",
  authMiddleware.checkPermission(PERMISSION.PRODUCT_CATEGORY.VIEW),
  controller.detail);

module.exports = router;