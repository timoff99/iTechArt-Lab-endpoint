const Router = require("express");
const controller = require("../controllers/recipe.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addRecipe);
router.get("/get-all", controller.getAllRecipes);
router.get("/get-user-recipes", controller.getUserRecipes);
router.get("/get", controller.getRecipe);
router.get("/get-recipe-without-cookbook", controller.getRecipeWithoutCookBook);
router.put("/update-recipe-cookbookid", controller.updateRecipeCookBookId);
router.put("/update", controller.updateRecipe);
router.delete("/delete", controller.deleteRecipes);

module.exports = router;
