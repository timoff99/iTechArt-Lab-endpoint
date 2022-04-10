const Router = require("express");
const { CookbookCollectionRoutes } = require("../constants/CookbookCollection");
const controller = require("../controllers/cookbookCollection.controller");

const router = new Router();

router.get(CookbookCollectionRoutes.getAll, controller.getAllCollection);
router.get(CookbookCollectionRoutes.get, controller.getOneCollection);
router.post(CookbookCollectionRoutes.create, controller.createCollection);
router.delete(
  CookbookCollectionRoutes.deleteCollection,
  controller.deleteCollection
);
router.delete(
  CookbookCollectionRoutes.deleteCollectionFiled,
  controller.deleteCollectionFiled
);

module.exports = router;
