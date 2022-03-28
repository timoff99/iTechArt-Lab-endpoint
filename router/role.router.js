const Router = require("express");
const { RoleRoutes } = require("../constants/role");
const controller = require("../controllers/role.controller");

const router = new Router();

router.post(RoleRoutes.create, controller.addRole);

module.exports = router;
