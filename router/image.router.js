const Router = require("express");
const controller = require("../controllers/image.controller");
const upload = require("../utils/multer");
const router = new Router();

router.post("/create", upload.single("image"), controller.addImage);

module.exports = router;
