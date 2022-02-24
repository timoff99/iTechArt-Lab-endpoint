const Router = require("express");
const controller = require("../controllers/cookbook.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addCookBook);
router.get("/get-all-cookbooks", controller.getAllCookBooks);
router.get("/get-user-cookbooks", controller.getUserCookBooks);
router.get("/get", controller.getCookBook);
router.get("/get-filtered-cookbooks", controller.getFilteredCookBook);
router.put("/update-comments", controller.updateCookBookComments);
router.put("/update", controller.updateCookBook);
router.put("/update-likes", controller.updateCookBookLikes);
router.delete("/delete", controller.deleteCookBook);

module.exports = router;
