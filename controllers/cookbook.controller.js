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
      const cookBook = await CookBook.find({ user_id: req.user.id })
        .populate("comments")
        .populate("recipes");
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
      )
        .populate("recipes")
        .populate({
          path: "comments",
          populate: {
            path: "user_id",
          },
        });
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
  async getFilteredCookBook(req, res) {
    try {
      const { type, sort } = req.query;
      const { id } = req.user;
      const sorted = await cookBookService.getFilteredCookBook(type, sort, id);
      res.json(sorted);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBookComments(req, res) {
    try {
      const { card_id, comment_id } = req.body;
      const updatedCookBook = await CookBook.findOneAndUpdate(
        { _id: card_id },
        {
          $push: { comments: comment_id },
        }
      );
      res.json(updatedCookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBookLikes(req, res) {
    try {
      const { id } = req.user;
      const _id = req.query[0];
      const exists = await CookBook.find({
        _id: _id,
        likes: { $exists: true, $in: [id] },
      });
      let updatedCookBook;
      if (exists?.length) {
        updatedCookBook = await CookBook.updateOne(
          { _id: _id },
          { $pull: { likes: id } }
        );
      } else {
        updatedCookBook = await CookBook.updateOne(
          { _id: _id },
          { $push: { likes: id } }
        );
      }
      res.json(updatedCookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBook(req, res) {
    try {
      const { image } = req.body;
      const { cloudinary_id } = image;
      const cookBook = await CookBook.findById(req.body._id);
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }
      const updateCookBook = await cookBookService.updateCookBook(
        cookBook,
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
      const cookBook = await CookBook.findById(req.query[0]);
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
