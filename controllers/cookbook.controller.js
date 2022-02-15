const CookBook = require("../models/CookBook");
const cookBookService = require("../services/cookbook.service");
const cloudinary = require("../utils/cloudinary");

class CookBookController {
  async addCookBook(req, res) {
    try {
      const { title, description, recipes, image } = req.body;
      const { id, username } = req.user;
      const { secure_url, public_id } = image;
      const cookBook = await cookBookService.addCookBook(
        title,
        description,
        username,
        secure_url,
        public_id,
        recipes,
        id
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
      const cookBook = await CookBook.findById(req.query._id).populate(
        "recipes"
      );
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBookViews(req, res) {
    try {
      //lol
      const { _id } = req.body;
      const updatedCookBook = await CookBook.findByIdAndUpdate(
        _id,
        { $inc: { views: 1 } },
        { new: true }
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
      const { _id } = req.body;
      const checkUserLike = await CookBook.find({ _id }).exists("likes", true);
      const updatedCookBook = await CookBook.findByIdAndUpdate(
        _id,
        { $inc: { views: 1 } },
        { new: true }
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
