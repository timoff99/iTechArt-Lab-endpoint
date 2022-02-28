const Router = require("express");
const controller = require("../controllers/recipe.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addRecipe);
router.get("/get-all-recipes", controller.getAllRecipes);
router.get("/get-user-recipes", controller.getUserRecipes);
router.get("/get", controller.getRecipe);
router.get("/get-recipe-without-cookbook", controller.getRecipeWithoutCookBook);
router.get("/get-filtered-recipes", controller.getFilteredRecipes);
router.put("/update-recipe-comments", controller.updateRecipeComments);
router.put("/update-recipe-cookbookid", controller.updateRecipeCookBookId);
router.put("/update", controller.updateRecipe);
router.put("/update-likes", controller.updateRecipeLikes);
router.delete("/delete-recipe-cookbookid", controller.deleteRecipesCookBookId);
router.delete("/delete", controller.deleteRecipes);

module.exports = router;
