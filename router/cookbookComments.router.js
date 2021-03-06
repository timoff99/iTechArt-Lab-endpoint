const Router = require("express");
const { CookBookCommentsRoutes } = require("../constants/cookbookComments");
const controller = require("../controllers/cookbookComments.controller");

const router = new Router();

router.delete(CookBookCommentsRoutes.delete, controller.deleteComments);

module.exports = router;
