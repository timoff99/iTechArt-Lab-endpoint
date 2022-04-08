const Router = require("express");
const { RecipeCollectionRoutes } = require("../constants/RecipeCollection");
const controller = require("../controllers/recipeCollection.controller");

const router = new Router();

router.post(RecipeCollectionRoutes.create, controller.createCollection);
router.delete(
  RecipeCollectionRoutes.deleteCollection,
  controller.deleteCollection
);

module.exports = router;
