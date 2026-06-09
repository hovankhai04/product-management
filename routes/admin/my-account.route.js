const express = require('express');
multer = require('multer');
const router = express.Router();

const upload = multer();

const controller = require('../../controllers/admin/my-account.controller');

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

router.get(
  '/',
  controller.index
);

router.get(
  '/edit',
  controller.edit
);

router.patch(
  '/edit',
  upload.single('avatar'),
  uploadCloud.upload,
  controller.editPatch
);
module.exports = router;