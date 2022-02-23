const Router = require("express");
const controller = require("../controllers/user.controller");

const router = new Router();

router.get("/get-user", controller.getUser);
router.put("/update-user", controller.updateUser);

module.exports = router;
