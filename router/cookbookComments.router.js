const Router = require("express");
const controller = require("../controllers/cookbookComments.controller");

const router = new Router();

router.post("/create", controller.createComments);

module.exports = router;
