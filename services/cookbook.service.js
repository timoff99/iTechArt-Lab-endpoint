const CookBook = require("../models/CookBook");
const cloudinary = require("../utils/cloudinary");
const { stableSort, getComparator } = require("../utils/tableSort");

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
  async getFilteredCookBook(type, sort, search, id, PAGE_SIZE, page) {
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
        let total;
        if (type.includes("hide-my-cookbooks")) {
          let hideMyCookbooks;
          if (search[0]) {
            hideMyCookbooks = await CookBook.find({
              title: { $regex: search[0] },
              user_id: { $exists: true, $nin: [id] },
            })
              .skip(page * PAGE_SIZE)
              .limit(PAGE_SIZE)
              .populate("comments");
          } else {
            hideMyCookbooks = await CookBook.find({
              user_id: { $exists: true, $nin: [id] },
            })
              .skip(page * PAGE_SIZE)
              .limit(PAGE_SIZE)
              .populate("comments");
          }

          sorted = hideMyCookbooks.sort(compareSort);
          total = await CookBook.countDocuments({
            user_id: { $exists: true, $nin: [id] },
          });
        } else {
          let cookBook;
          if (search[0]) {
            cookBook = await CookBook.find({
              title: { $regex: search[0] },
              types: { $exists: true, $in: type },
            })
              .skip(page * PAGE_SIZE)
              .limit(PAGE_SIZE)
              .populate("comments");
          } else {
            cookBook = await CookBook.find({
              types: { $exists: true, $in: type },
            })
              .skip(page * PAGE_SIZE)
              .limit(PAGE_SIZE)
              .populate("comments");
          }
          sorted = cookBook.sort(compareSort);
          total = await CookBook.countDocuments({
            types: { $exists: true, $in: type },
          });
        }
        return { sorted, total };
      } else if (sort) {
        let cookBook;
        if (search[0]) {
          cookBook = await CookBook.find({ title: { $regex: search[0] } })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("comments");
        } else {
          cookBook = await CookBook.find({})
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("comments");
        }
        const sorted = cookBook.sort(compareSort);
        const total = await CookBook.countDocuments({});
        return { sorted, total };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async allSortedCookbooks(order, orderBy, search) {
    try {
      const allCookbooks = search
        ? await CookBook.find({ title: { $regex: search } }).populate("user_id")
        : await CookBook.find({}).populate("user_id");
      return stableSort(allCookbooks, getComparator(order, orderBy));
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

  async deleteCookBook(cookbook) {
    try {
      await cloudinary.uploader.destroy(cookbook.cloudinary_id);
      await cookbook.remove();
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new CookBookService();
