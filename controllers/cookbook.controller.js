const CookBook = require("../models/CookBook");
const cookBookService = require("../services/cookbook.service");
const cloudinary = require("../utils/cloudinary");

class CookBookController {
  async addCookBook(req, res) {
    try {
      const { title, description, selectedRecipes, image, cookbookTypes } =
        req.body;
      const { id, username } = req.user;
      const { secure_url, public_id } = image;

      const cookBook = await cookBookService.addCookBook(
        title,
        description,
        username,
        secure_url,
        public_id,
        selectedRecipes,
        id,
        cookbookTypes
      );
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getAllCookBooks(req, res) {
    try {
      const cookBook = await CookBook.find();
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getUserCookBooks(req, res) {
    try {
      const cookBook = await CookBook.find({ user_id: req.user.id });
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getCookBook(req, res) {
    try {
      const _id = req.query[0];
      const cookBook = await CookBook.findByIdAndUpdate(
        _id,
        { $inc: { views: 1 } },
        { new: true }
      ).populate("recipes");
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getSortedCookBook(req, res) {
    try {
      const query = req.query[0];
      const type = "type";
      if (query?.includes(type)) {
        let resultType;
        if (query.lastIndexOf("&") > query.indexOf(type)) {
          resultType = query.slice(
            query.lastIndexOf(type) + type.length + 1,
            query.lastIndexOf("&")
          );
        } else {
          resultType = query.slice(query.lastIndexOf(type) + type.length + 1);
        }
        const typeArray = resultType.split("%2C");

        const cookBook = await CookBook.find({
          types: { $exists: true, $in: typeArray },
        });

        res.json(cookBook);
      } else {
        const cookBook = await CookBook.find({});
        res.json(cookBook);
      }
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getCookBooksSortBy(req, res) {
    try {
      const query = req.query[0];
      const { sortedCookBook } = req.body;
      const sort = "sort";
      if (query?.includes(sort)) {
        let resultSort;
        if (query.lastIndexOf("&") > query.indexOf(sort)) {
          resultSort = query.slice(
            query.lastIndexOf(sort) + sort.length + 1,
            query.lastIndexOf("&")
          );
        } else {
          resultSort = query.slice(query.lastIndexOf(sort) + sort.length + 1);
        }
        const sorted = sortedCookBook.sort((a, b) =>
          a.resultSort > b.resultSort ? 1 : b.resultSort > a.resultSort ? -1 : 0
        );

        res.json(sorted);
      } else {
        res.json(sortedCookBook);
      }
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBookLikes(req, res) {
    try {
      //lol
      const { id } = req.user;
      const { _id } = req.body;
      const updatedCookBook = await CookBook.findOneAndUpdate(
        { _id: _id, likes: { $exists: true } },
        { $inc: id }
      );
      res.json(updatedCookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBook(req, res) {
    // ?????
    try {
      const cookBook = await CookBook.findById(req.body._id);
      await cloudinary.uploader.destroy(cookBook.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const updateCookBook = await cookBookService.updateCookBook(
        cookBook,
        result,
        req
      );
      res.json(updateCookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async deleteCookBook(req, res) {
    try {
      const cookBook = await CookBook.findById(req.body.id);
      const deletedCookBook = await cookBookService.deleteCookBook(cookBook);
      res.json(deletedCookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
}

module.exports = new CookBookController();
