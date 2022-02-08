const CookBook = require("../models/CookBook");
const cookBookService = require("../services/cookbook.service");
const cloudinary = require("../utils/cloudinary");

class CookBookController {
  async addCookBook(req, res) {
    try {
      const { title, description, recipes } = req.body;
      const { id } = req.user;
      const result = await cloudinary.uploader.upload(req.file.path);
      const { secure_url, public_id } = result;
      const cookBook = await cookBookService.addCookBook(
        title,
        description,
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
      const cookBook = await CookBook.findById(req.params.id);
      res.json(cookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateCookBook(req, res) {
    try {
      const cookBook = await CookBook.findById(req.params.id);
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
      const cookBook = await CookBook.findById(req.params.id);
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
