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

  async addCookBookClone(req, res) {
    try {
      const { _id } = req.body;
      const { id } = req.user;
      const cookbook = await CookBook.findOne({ _id });
      const {
        title,
        description,
        username,
        image,
        cloudinary_id,
        recipes,
        types,
      } = cookbook;
      const clone = new CookBook({
        title,
        description,
        username,
        image,
        views: 0,
        likes: [],
        cloudinary_id,
        recipes,
        user_id: id,
        types,
      });
      await clone.save();
      res.json(clone);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getUserCookBooks(req, res) {
    try {
      const PAGE_SIZE = 12;
      const total = await CookBook.countDocuments({ user_id: req.user.id });
      const page = parseInt(req.query.page || "0");
      const cookBook = await CookBook.find({ user_id: req.user.id })
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .populate("comments")
        .populate("recipes");
      const totalPages = Math.ceil(total / PAGE_SIZE);
      res.json({ cookBook, totalPages });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getCookBook(req, res) {
    try {
      const { _id } = req.query;
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

  async getCookBooksForMain(req, res) {
    try {
      const { limit, type } = req.query;

      const compareSort = (a, b) => {
        if (Array.isArray(a[type])) {
          return a[type].length < b[type].length
            ? 1
            : b[type].length < a[type].length
            ? -1
            : 0;
        }
        return a[type] < b[type] ? 1 : b[type] < a[type] ? -1 : 0;
      };

      const cookbooks = await CookBook.find({})
        .limit(limit)
        .populate("comments");
      const sorted = cookbooks.sort(compareSort);
      res.json({ cookbooks: sorted });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getFilteredCookBook(req, res) {
    try {
      const PAGE_SIZE = 12;
      const page = parseInt(req.query.page || "0");
      const { type, sort, search } = req.query;
      const { id } = req.user;
      const { sorted, total } = await cookBookService.getFilteredCookBook(
        type,
        sort,
        search,
        id,
        PAGE_SIZE,
        page
      );
      const totalPages = sorted.length ? Math.ceil(total / PAGE_SIZE) : 0;
      res.json({ sorted, totalPages });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getCookbookStatistics(req, res) {
    try {
      const cookbookCount = await CookBook.find({}).countDocuments();
      const cookbookViews = await CookBook.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$views",
            },
          },
        },
      ]);
      const mostPopularCookbook = await CookBook.find()
        .sort({ views: -1 })
        .limit(1);
      res.json({ cookbookCount, cookbookViews, mostPopularCookbook });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
  }
  async getAllSortedCookbooks(req, res) {
    try {
      const { order, orderBy } = req.query;
      const allSortedCookbooks = await cookBookService.allSortedCookbooks(
        order,
        orderBy
      );
      res.json({ allSortedCookbooks });
    } catch (err) {
      return res.status(400).json({
        message: err.message,
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
      const { _id } = req.query;
      const exists = await CookBook.find({
        _id,
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
      const { _id } = req.query;
      const cookbook = await CookBook.findById(_id);
      const deletedCookBook = await cookBookService.deleteCookBook(cookbook);
      res.json(deletedCookBook);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
}

module.exports = new CookBookController();
