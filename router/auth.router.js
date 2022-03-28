const Router = require("express");
const { check } = require("express-validator");
const { AuthRoutes } = require("../constants/auth");
const controller = require("../controllers/auth.controller");

const router = new Router();

router.post(
  AuthRoutes.signup,
  [
    check("email", "not valid email").trim().isEmail(),
    check("password", "cannot be empty").trim().notEmpty(),
  ],
  controller.signup
);
router.post(AuthRoutes.login, controller.login);
module.exports = router;
