const Router = require("express");
const controller = require("../controllers/recipe.controller");
const upload = require("../utils/multer");

const router = new Router();

router.post("/create", upload.single("image"), controller.addRecipe);
router.get("/getAll", controller.getAllRecipes);
router.get("/getUserRecipes", controller.getUserRecipes);
router.get("/get/:id", controller.getRecipe);
router.put("/update/:id", controller.updateRecipe);
router.delete("/:id", controller.deleteRecipes);

module.exports = router;
