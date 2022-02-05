const Router = require("express");
const controller = require("../controllers/role.controller");

const router = new Router();

router.post('/create', controller.addRole)

module.exports = router
