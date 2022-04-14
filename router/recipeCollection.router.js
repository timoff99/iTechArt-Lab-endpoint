const Router = require("express");
const { RecipeCollectionRoutes } = require("../constants/RecipeCollection");
const controller = require("../controllers/recipeCollection.controller");

const router = new Router();

router.get(RecipeCollectionRoutes.getAll, controller.getAllCollection);
router.get(RecipeCollectionRoutes.get, controller.getOneCollection);
router.post(RecipeCollectionRoutes.create, controller.createCollection);
router.delete(
  RecipeCollectionRoutes.deleteCollection,
  controller.deleteCollection
);
router.delete(
  RecipeCollectionRoutes.deleteCollectionFiled,
  controller.deleteCollectionFiled
);

module.exports = router;
