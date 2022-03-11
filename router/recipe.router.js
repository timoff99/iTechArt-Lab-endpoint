const Router = require("express");
const controller = require("../controllers/recipe.controller");
const upload = require("../utils/multer");
const auth = require("../middleware/auth.middleware");

const router = new Router();

router.post("/create", upload.single("image"), auth, controller.addRecipe);
router.post("/create-clone", auth, controller.addRecipeClone);
router.get("/get-user-recipes", auth, controller.getUserRecipes);
router.get("/get", controller.getRecipe);
router.get("/get-recipe-without-cookbook", controller.getRecipeWithoutCookBook);
router.get("/get-filtered-recipes", auth, controller.getFilteredRecipes);
router.get("/get-recipes-for-main", controller.getRecipesForMain);
router.put("/update-recipe-comments", controller.updateRecipeComments);
router.put("/update-recipe-cookbookid", controller.updateRecipeCookBookId);
router.put("/update", controller.updateRecipe);
router.put("/update-likes", auth, controller.updateRecipeLikes);
router.delete("/delete-recipe-cookbookid", controller.deleteRecipesCookBookId);
router.delete("/delete", controller.deleteRecipes);

module.exports = router;
