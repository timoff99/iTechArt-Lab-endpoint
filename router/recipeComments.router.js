const Router = require("express");
const { RecipeCommentsRoutes } = require("../constants/recipeComments");
const controller = require("../controllers/recipeComments.controller");

const router = new Router();

router.post(RecipeCommentsRoutes.create, controller.createComments);
router.delete(RecipeCommentsRoutes.delete, controller.deleteComments);

module.exports = router;
