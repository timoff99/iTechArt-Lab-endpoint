const Router = require("express");
const controller = require("../controllers/cookbook.controller");
const upload = require("../utils/multer");
const auth = require("../middleware/auth.middleware");
const { CookBookRoutes } = require("../constants/cookbook");

const router = new Router();

router.post(
  CookBookRoutes.create,
  upload.single("image"),
  auth,
  controller.addCookBook
);
router.post(CookBookRoutes.createClone, auth, controller.addCookBookClone);
router.get(CookBookRoutes.getUserCookbooks, auth, controller.getUserCookBooks);
router.get(CookBookRoutes.get, controller.getCookBook);
router.get(
  CookBookRoutes.getFilteredCookbooks,
  auth,
  controller.getFilteredCookBook
);
router.get(CookBookRoutes.getCookbooksForMain, controller.getCookBooksForMain);
router.put(CookBookRoutes.updateComments, controller.updateCookBookComments);
router.put(CookBookRoutes.update, controller.updateCookBook);
router.put(CookBookRoutes.updateLikes, auth, controller.updateCookBookLikes);
router.delete(CookBookRoutes.delete, controller.deleteCookBook);

module.exports = router;
