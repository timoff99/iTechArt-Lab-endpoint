const Recipe = require("../models/Recipe");
const cloudinary = require("../utils/cloudinary");
const { getComparator, stableSort } = require("../utils/tableSort");

class RecipeService {
  async addRecipe(
    title,
    description,
    ingredients,
    steps,
    username,
    cooking_time,
    secure_url,
    public_id,
    id
  ) {
    try {
      const recipe = new Recipe({
        title,
        description,
        author: username,
        ingredients,
        steps,
        views: 0,
        likes: [],
        cooking_time,
        image: secure_url,
        cloudinary_id: public_id,
        user_id: id,
      });
      return await recipe.save();
    } catch (err) {
      console.log(err);
    }
  }

  async getAllRecipes() {
    return Recipe.find({});
  }

  async updateRecipeCookBookId(ids, cookbook_id) {
    try {
      const result = [];
      for (let index = 0; index < ids.length; index++) {
        let update = await Recipe.findByIdAndUpdate(ids[index]._id, {
          cookbook_id: cookbook_id,
        });
        result.push(update);
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async updateRecipe(recipes, req) {
    try {
      const data = {
        title: req.body.title || recipes.title,
        description: req.body.description || recipes.description,
        ingredients: req.body.ingredients || recipes.ingredients,
        steps: req.body.steps || recipes.steps,
        image: req.body.image.secure_url || recipes.image,
        cooking_time: req.body.cooking_time || recipes.cooking_time,
        cloudinary_id: req.body.image.public_id || recipes.cloudinary_id,
      };
      const updateRecipe = await Recipe.findByIdAndUpdate(req.body._id, data, {
        new: true,
      });
      return updateRecipe;
    } catch (err) {
      console.log(err);
    }
  }

  async getUserRecipes(search, page, id, PAGE_SIZE) {
    try {
      let recipes;
      if (search[0]) {
        recipes = await Recipe.find({
          user_id: id,
          title: { $regex: search[0], $options: "i" },
        })
          .skip(page * PAGE_SIZE)
          .limit(PAGE_SIZE)
          .populate("comments");
      } else {
        recipes = await Recipe.find({
          user_id: id,
        })
          .skip(page * PAGE_SIZE)
          .limit(PAGE_SIZE)
          .populate("comments");
      }
      return recipes;
    } catch (err) {
      console.log(err);
    }
  }
  async getFilteredRecipes(type, timeRange, search, id, sort, page, PAGE_SIZE) {
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

      if (type) {
        let recipe;
        if (search[0]) {
          recipe = await Recipe.find({
            title: { $regex: search[0], $options: "i" },
            cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
            likes: { $exists: true, $in: [id] },
          })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("comments");
        } else {
          recipe = await Recipe.find({
            cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
            likes: { $exists: true, $in: [id] },
          })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("comments");
        }
        const recipes = recipe.sort(compareSort);

        const total = await Recipe.countDocuments({
          cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
        });

        const sorted = recipes.sort(compareSort);
        return { recipe: sorted, total };
      } else {
        let recipe;
        if (search[0]) {
          recipe = await Recipe.find({
            title: { $regex: search[0], $options: "i" },
            cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
          })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("comments");
        } else {
          recipe = await Recipe.find({
            cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
          })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate("comments");
        }
        const recipes = recipe.sort(compareSort);

        const total = await Recipe.countDocuments({
          cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
        });

        const sorted = recipes.sort(compareSort);
        return { recipe: sorted, total };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async allSortedRecipes(order, orderBy, search) {
    try {
      const allRecipes = await Recipe.find({
        title: { $regex: search, $options: "i" },
      }).populate("user_id");
      return stableSort(allRecipes, getComparator(order, orderBy));
    } catch (err) {
      console.log(err);
    }
  }
  async deleteRecipes(recipe) {
    try {
      await cloudinary.uploader.destroy(recipe.cloudinary_id);
      await recipe.remove();
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new RecipeService();
