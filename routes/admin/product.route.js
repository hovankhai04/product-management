const express = require('express');
const multer = require('multer');
const router = express.Router();
const validate = require('../../validates/admin/product.validate');

const upload = multer();

const controller = require('../../controllers/admin/product.controller');

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const PERMISSION = require('../../permissions/admin/admin.permission');

router.get(
  '/',
  authMiddleware.checkPermission(PERMISSION.PRODUCT.VIEW),
  controller.index);

router.patch(
  "/change-status/:status/:id",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.EDIT),
  controller.changeStatus);  // :status là truyền động vào url

router.patch(
  "/change-multi",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.EDIT),
  controller.changeMulti);

router.delete(
  "/delete/:id",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.DELETE),
  controller.deleteItem);

router.get(
  "/create",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.CREATE),
  controller.create);

router.post(
  "/create",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.CREATE),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

router.get(
  "/edit/:id",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.EDIT),
  controller.edit);

router.patch(
  "/edit/:id",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.EDIT),
  upload.single('thumbnail'),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);

router.get(
  "/detail/:id",
  authMiddleware.checkPermission(PERMISSION.PRODUCT.VIEW),
  controller.detail);

module.exports = router;
