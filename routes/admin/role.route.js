const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/role.controller');

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const PERMISSION = require('../../permissions/admin/admin.permission');

router.get(
  '/',
  authMiddleware.checkPermission(PERMISSION.ROLES.VIEW),
  controller.index);

router.get(
  '/create',
  authMiddleware.checkPermission(PERMISSION.ROLES.CREATE),
  controller.create);

router.post(
  '/create',
  authMiddleware.checkPermission(PERMISSION.ROLES.CREATE),
  controller.createPost);

router.get(
  '/edit/:id',
  authMiddleware.checkPermission(PERMISSION.ROLES.EDIT),
  controller.edit);

router.patch(
  '/edit/:id',
  authMiddleware.checkPermission(PERMISSION.ROLES.EDIT),
  controller.editPatch);

router.get(
  '/detail/:id',
  authMiddleware.checkPermission(PERMISSION.ROLES.VIEW),
  controller.detail);

router.get(
  '/permissions',
  authMiddleware.checkPermission(PERMISSION.ROLES.PERMISSIONS),
  controller.permissions);

router.patch(
  '/permissions',
  authMiddleware.checkPermission(PERMISSION.ROLES.PERMISSIONS),
  controller.permissionsPatch);

module.exports = router;