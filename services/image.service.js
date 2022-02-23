const cloudinary = require("../utils/cloudinary");

class ImageService {
  async addImage(file) {
    try {
      const imageResult = await cloudinary.uploader.upload(file);
      return imageResult;
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new ImageService();
