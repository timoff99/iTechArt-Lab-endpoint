const Router = require("express");
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

const router = new Router();

router.get("/get-all-users", controller.getAllUsers);
router.get("/get-user", auth, controller.getUser);
router.put("/update-user", auth, controller.updateUser);
router.put("/update-user-cookbooks", auth, controller.updateUserCookBooks);
router.put("/update-user-recipes", auth, controller.updateUserRecipes);
router.put("/update-user-status", controller.updateUserStatus);
router.delete(
  "/delete-user-cookbook-id",
  auth,
  controller.deleteUserCookBookId
);
router.delete("/delete-user-recipes-id", auth, controller.deleteUserRecipeId);
router.put("/reset-password", controller.resetPass);

module.exports = router;
