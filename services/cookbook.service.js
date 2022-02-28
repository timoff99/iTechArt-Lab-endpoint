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
    id,
    cookbookTypes
  ) {
    try {
      const cookBook = new CookBook({
        title,
        description,
        author: username,
        image: secure_url,
        views: 0,
        likes: [],
        cloudinary_id: public_id,
        recipes: selectedRecipes,
        user_id: id,
        types: cookbookTypes,
      });
      return await cookBook.save();
    } catch (err) {
      console.log(err);
    }
  }
  async getFilteredCookBook(type, sort, id) {
    try {
      const compareSort = (a, b) => {
        if (Array.isArray(a[sort])) {
          return a[sort].length < b[sort].length
            ? 1
            : b[sort].length < a[sort].length
            ? -1
            : 0;
        }
        return a[sort] < b[sort] ? 1 : b[sort] < a[sort] ? -1 : 0;
      };

      if (type && sort) {
        let sorted = {};
        if (type.includes("hide-my-cookbooks")) {
          const hideMyCookbooks = await CookBook.find({
            user_id: { $exists: true, $nin: [id] },
          }).populate("comments");

          sorted = hideMyCookbooks.sort(compareSort);
        } else {
          const cookBook = await CookBook.find({
            types: { $exists: true, $in: type },
          }).populate("comments");
          sorted = cookBook.sort(compareSort);
        }
        return sorted;
      } else if (sort) {
        const cookBook = await CookBook.find({}).populate("comments");
        const sorted = cookBook.sort(compareSort);
        return sorted;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async updateCookBook(cookBook, req) {
    try {
      const data = {
        title: req.body.title || cookBook.title,
        description: req.body.description || cookBook.description,
        types: req.body.cookbookTypes || cookBook.types,
        image: req.body.image.secure_url || cookBook.image,
        cloudinary_id: req.body.image.public_id || cookBook.cloudinary_id,
        recipes: req.body.selectedRecipes || cookBook.recipes,
      };
      const updateCookBook = await CookBook.findByIdAndUpdate(
        req.body._id,
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
