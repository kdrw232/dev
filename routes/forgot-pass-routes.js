const express = require("express");
const router = express.Router();
const {
  getForgotPasswordView,
  sendForgotPasswordLink,
  getResetPasswordView,
  resetThePassword,
} = require("../controller/passwordController");


router.route("/forgot-password")
.get(getForgotPasswordView)
.post(sendForgotPasswordLink)

router.route('/reset-password/:id/:token')
.get(getResetPasswordView).post(resetThePassword)
module.exports = router