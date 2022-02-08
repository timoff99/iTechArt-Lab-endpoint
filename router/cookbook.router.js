const Router = require("express");
const controller = require("../controllers/cookbook.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addCookBook);
router.get("/get", controller.getCookBook);
router.delete("/:id", controller.deleteCookBook);

module.exports = router;
