const Router = require("express");
const { CookbookCollectionRoutes } = require("../constants/CookbookCollection");
const controller = require("../controllers/cookbookCollection.controller");

const router = new Router();

router.post(CookbookCollectionRoutes.create, controller.createCollection);
router.delete(
  CookbookCollectionRoutes.deleteCollection,
  controller.deleteCollection
);

module.exports = router;
