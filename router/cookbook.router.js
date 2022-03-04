const Router = require("express");
const controller = require("../controllers/cookbook.controller");
const upload = require("../utils/multer");
const auth = require("../middleware/auth.middleware");

const router = new Router();

router.post("/create", upload.single("image"), auth, controller.addCookBook);
router.post("/create-clone", auth, controller.addCookBookClone);
router.get("/get-user-cookbooks", auth, controller.getUserCookBooks);
router.get("/get", controller.getCookBook);
router.get("/get-filtered-cookbooks", auth, controller.getFilteredCookBook);
router.get("/get-cookbooks-for-main", controller.getCookBooksForMain);
router.put("/update-comments", controller.updateCookBookComments);
router.put("/update", controller.updateCookBook);
router.put("/update-likes", auth, controller.updateCookBookLikes);
router.delete("/delete", controller.deleteCookBook);

module.exports = router;
