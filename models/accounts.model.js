const mongoose = require('mongoose');
const generate = require('../helpers/generate');

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
      type: String,
      default: generate.generateRandomString(20),
    },
    phone: String,
    avatar: String,
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true, // tạo các field createdAt, updatedAt khi tạo mới sản phẩm
  },
);

const Account = mongoose.model('Account', accountSchema, 'accounts'); // tên Model/schema/collection

module.exports = Account;
