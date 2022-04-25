const Router = require("express");
const { RecipeCommentsRoutes } = require("../constants/recipeComments");
const controller = require("../controllers/recipeComments.controller");

const router = new Router();

router.delete(RecipeCommentsRoutes.delete, controller.deleteComments);

module.exports = router;
