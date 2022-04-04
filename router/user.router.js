const Router = require("express");
const { UserRoutes } = require("../constants/user");
const controller = require("../controllers/user.controller");
const auth = require("../middleware/auth.middleware");

const router = new Router();

router.get(UserRoutes.getAllUsers, controller.getAllUsers);
router.get(UserRoutes.getUser, auth, controller.getUser);
router.get(UserRoutes.getUserStatistics, auth, controller.getUserStatistics);
router.put(UserRoutes.updateUser, auth, controller.updateUser);
router.put(
  UserRoutes.updateUserCookbooks,
  auth,
  controller.updateUserCookBooks
);
router.put(UserRoutes.updateUserRecipes, auth, controller.updateUserRecipes);
router.put(UserRoutes.updateUserStatus, controller.updateUserStatus);
router.delete(
  UserRoutes.deleteUserCookbookId,
  auth,
  controller.deleteUserCookBookId
);
router.delete(
  UserRoutes.deleteUserRecipesId,
  auth,
  controller.deleteUserRecipeId
);
router.delete(UserRoutes.delete, controller.deleteUser);
router.put(UserRoutes.resetPassword, controller.resetPass);

module.exports = router;
