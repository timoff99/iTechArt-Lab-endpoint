const Router = require("express");
const controller = require("../controllers/recipe.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addRecipe);
router.get("/get", controller.getRecipes);
router.delete("/:id", controller.deleteRecipes);

module.exports = router;
