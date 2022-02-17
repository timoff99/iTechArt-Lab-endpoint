const CookBook = require("../models/CookBook");
const cloudinary = require("../utils/cloudinary");

class CookBookService {
  async addCookBook(
    title,
    description,
    username,
    secure_url,
    public_id,
    selectedRecipes,
    id
  ) {
    try {
      const cookBook = new CookBook({
        title,
        description,
        author: username,
        image: secure_url,
        cloudinary_id: public_id,
        recipes: selectedRecipes,
        user_id: id,
      });
      return await cookBook.save();
    } catch (err) {
      console.log(err);
    }
  }

  async updateCookBook(cookBook, result, req) {
    try {
      const data = {
        title: req.body.title || cookBook.title,
        description: req.body.description || cookBook.description,
        image: result.secure_url || cookBook.image,
        cloudinary_id: result.public_id || cookBook.cloudinary_id,
        recipes: req.body.recipes || cookBook.recipes,
        user_id: cookBook.user_id,
      };
      const updateCookBook = await CookBook.findByIdAndUpdate(
        req.params.id,
        data,
        {
          new: true,
        }
      );
      return updateCookBook;
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
