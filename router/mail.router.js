const Router = require("express");
const controller = require("../controllers/mail.controller");
const router = new Router();

router.post("/forgot-password", controller.sendForgotPasswordMail);

module.exports = router;
