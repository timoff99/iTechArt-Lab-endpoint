const Router = require("express");
const { check } = require("express-validator");
const controller = require("../controllers/authController");

const router = new Router();

router.post(
  "/signup",
  [
    check("email", "not valid email").trim().isEmail(),
    check("password", "cannot be empty").trim().notEmpty(),
  ],
  controller.signup
);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/users", controller.getUsers);

module.exports = router;
