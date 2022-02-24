const Router = require("express");
const controller = require("../controllers/recipeComments.controller");

const router = new Router();

router.post("/create", controller.createComments);

module.exports = router;
