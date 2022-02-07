const Router = require("express");
const controller = require("../controllers/user.controller");

const router = new Router();

router.get("/get-user", controller.getUser);

module.exports = router;
