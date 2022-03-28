const Router = require("express");
const { ImageRoutes } = require("../constants/image");
const controller = require("../controllers/image.controller");
const upload = require("../utils/multer");
const router = new Router();

router.post(ImageRoutes.create, upload.single("image"), controller.addImage);

module.exports = router;
