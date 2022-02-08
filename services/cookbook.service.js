const CookBook = require("../models/CookBook");
const cloudinary = require("../utils/cloudinary");

class CookBookService {
  async addCookBook(title, description, secure_url, public_id, recipes, id) {
    try {
      const cookBook = new CookBook({
        title,
        description,
        image: secure_url,
        cloudinary_id: public_id,
        recipes,
        user_id: id,
      });
      return await cookBook.save();
    } catch (err) {
      console.log(err);
    }
  }

  async deleteCookBook(cookBook) {
    try {
      await cloudinary.uploader.destroy(cookBook.cloudinary_id);
      await cookBook.remove();
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new CookBookService();
