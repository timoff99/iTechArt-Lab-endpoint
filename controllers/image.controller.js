const imageService = require("../services/image.service");

class ImageController {
  async addImage(req, res) {
    try {
      const imageResult = await imageService.addImage(req.file.path);
      res.json(imageResult);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
}

module.exports = new ImageController();
