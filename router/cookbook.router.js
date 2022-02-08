const Router = require("express");
const controller = require("../controllers/cookbook.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addCookBook);
router.get("/getAll", controller.getAllCookBooks);
router.get("/getUserCookBooks", controller.getUserCookBooks);
router.get("/get/:id", controller.getCookBook);
router.put("/update/:id", controller.updateCookBook);
router.delete("/:id", controller.deleteCookBook);

module.exports = router;
