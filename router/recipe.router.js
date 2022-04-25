const Router = require("express");
const controller = require("../controllers/recipe.controller");
const upload = require("../utils/multer");
const auth = require("../middleware/auth.middleware");
const { RecipeRoutes } = require("../constants/recipe");

const router = new Router();

router.post(
  RecipeRoutes.create,
  upload.single("image"),
  auth,
  controller.addRecipe
);
router.post(RecipeRoutes.createClone, auth, controller.addRecipeClone);
router.get(RecipeRoutes.getAllRecipes, controller.getAllRecipes);
router.get(RecipeRoutes.getUserRecipes, auth, controller.getUserRecipes);
router.get(RecipeRoutes.get, controller.getRecipe);
router.get(
  RecipeRoutes.getRecipeWithoutViewsPlusOne,
  controller.getRecipeWithoutViewsPlusOne
);
router.get(
  RecipeRoutes.getRecipeWithoutCookbook,
  auth,
  controller.getRecipeWithoutCookBook
);
router.get(
  RecipeRoutes.getFilteredRecipes,
  auth,
  controller.getFilteredRecipes
);
router.get(RecipeRoutes.getRecipeStatistics, controller.getRecipeStatistics);
router.get(RecipeRoutes.getAllSortedRecipes, controller.getAllSortedRecipes);
router.get(RecipeRoutes.getRecipesForMain, controller.getRecipesForMain);
router.put(RecipeRoutes.updateRecipeComments, controller.updateRecipeComments);
router.put(
  RecipeRoutes.updateRecipeCookbookid,
  controller.updateRecipeCookBookId
);
router.put(RecipeRoutes.update, controller.updateRecipe);
router.put(RecipeRoutes.updateLikes, auth, controller.updateRecipeLikes);
router.delete(
  RecipeRoutes.deleteRecipeCookbookid,
  controller.deleteRecipesCookBookId
);
router.delete(RecipeRoutes.delete, controller.deleteRecipes);
router.delete(RecipeRoutes.deleteCommentsId, controller.deleteRecipeCommentsId);

module.exports = router;
