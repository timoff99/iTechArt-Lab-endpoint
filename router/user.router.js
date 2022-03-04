const Router = require("express");
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

const router = new Router();

router.get("/get-user", auth, controller.getUser);
router.put("/update-user", auth, controller.updateUser);
router.put("/reset-password", controller.resetPass);

module.exports = router;
