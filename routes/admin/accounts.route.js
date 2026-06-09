const express = require('express');
const router = express.Router();

const multer = require('multer');

const upload = multer();

const controller = require('../../controllers/admin/account.controller');

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const validate = require('../../validates/admin/accounts.validate');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const PERMISSION = require('../../permissions/admin/admin.permission');

router.get(
  '/',
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.VIEW),
  controller.index
);

router.get(
  '/create',
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.CREATE),
  controller.create
);

router.post(
  '/create',
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.CREATE),
  upload.single('avatar'),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost,
);

router.get(
  '/edit/:id',
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.EDIT),
  controller.edit
);

router.patch(
  '/edit/:id',
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.EDIT),
  upload.single('avatar'),
  uploadCloud.upload,
  validate.editPatch,
  controller.editPatch,
);

router.delete(
  '/delete/:id',
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.DELETE),
  controller.deleteAccount
);

router.get(
  "/detail/:id",
  authMiddleware.checkPermission(PERMISSION.ACCOUNTS.VIEW),
  controller.detail
);
module.exports = router;
