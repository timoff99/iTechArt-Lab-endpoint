const Router = require("express");
const { MainRoutes } = require("../constants/mail");
const controller = require("../controllers/mail.controller");
const router = new Router();

router.post(MainRoutes.forgotPassword, controller.sendForgotPasswordMail);

module.exports = router;
