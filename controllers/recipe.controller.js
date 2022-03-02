const Recipe = require("../models/Recipe");
const recipeService = require("../services/recipe.service");
const cloudinary = require("../utils/cloudinary");

class RecipeController {
  async addRecipe(req, res) {
    try {
      const { title, description, ingredients, steps, image, cooking_time } =
        req.body;
      const { id, username } = req.user;
      const { secure_url, public_id } = image;
      const recipe = await recipeService.addRecipe(
        title,
        description,
        ingredients,
        steps,
        username,
        cooking_time,
        secure_url,
        public_id,
        id
      );
      res.json(recipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async addRecipeClone(req, res) {
    try {
      const { _id } = req.body;
      const { id } = req.user;
      const recipe = await Recipe.findOne({ _id });
      const clone = new Recipe({
        title: recipe.title,
        description: recipe.title,
        author: recipe.username,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        views: 0,
        likes: [],
        cooking_time: recipe.cooking_time,
        image: recipe.image,
        cloudinary_id: recipe.cloudinary_id,
        user_id: id,
      });
      await clone.save();
      res.json(clone);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getUserRecipes(req, res) {
    try {
      const PAGE_SIZE = 12;
      const total = await Recipe.countDocuments({ user_id: req.user.id });
      const page = parseInt(req.query.page || "0");

      const recipes = await Recipe.find({ user_id: req.user.id })
        .skip(page * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .populate("comments");
      const totalPages = Math.ceil(total / PAGE_SIZE);

      res.json({ recipes, totalPages });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getRecipe(req, res) {
    try {
      const _id = req.query[0];
      const recipes = await Recipe.findByIdAndUpdate(
        _id,
        { $inc: { views: 1 } },
        { new: true }
      ).populate({
        path: "comments",
        populate: {
          path: "user_id",
        },
      });

      res.json(recipes);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getRecipeWithoutCookBook(req, res) {
    try {
      const recipes = await Recipe.find({ cookbook_id: { $exists: false } });
      res.json(recipes);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getRecipesForMain(req, res) {
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

      const recipes = await Recipe.find({}).limit(limit).populate("comments");
      const sorted = recipes.sort(compareSort);
      res.json({ recipes: sorted });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getFilteredRecipes(req, res) {
    try {
      const PAGE_SIZE = 12;
      const page = parseInt(req.query.page || "0");
      const { timeRange, search, sort } = req.query;

      const { recipe, total } = await recipeService.getFilteredRecipes(
        timeRange,
        search,
        sort,
        page,
        PAGE_SIZE
      );
      const totalPages = Math.ceil(total / PAGE_SIZE);

      res.json({ recipe, totalPages });
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateRecipeComments(req, res) {
    try {
      const { card_id, comment_id } = req.body;
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: card_id },
        {
          $push: { comments: comment_id },
        }
      );
      res.json(updatedRecipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateRecipeCookBookId(req, res) {
    try {
      const { selectedRecipes: ids, _id: cookbook_id } = req.body;
      const updateRecipe = await recipeService.updateRecipeCookBookId(
        ids,
        cookbook_id
      );
      res.json(updateRecipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateRecipe(req, res) {
    try {
      const { image } = req.body;
      const { cloudinary_id } = image;
      const recipes = await Recipe.findById(req.body._id);
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }
      const updateRecipe = await recipeService.updateRecipe(recipes, req);
      res.json(updateRecipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async updateRecipeLikes(req, res) {
    try {
      const { id } = req.user;
      const _id = req.query[0];
      const exists = await Recipe.find({
        _id: _id,
        likes: { $exists: true, $in: [id] },
      });
      let updatedRecipe;
      if (exists?.length) {
        updatedRecipe = await Recipe.updateOne(
          { _id: _id },
          { $pull: { likes: id } }
        );
      } else {
        updatedRecipe = await Recipe.updateOne(
          { _id: _id },
          { $push: { likes: id } }
        );
      }
      res.json(updatedRecipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async deleteRecipesCookBookId(req, res) {
    try {
      const recipesId = req.body.selectedRecipes.map(({ _id }) => _id);
      const recipe = await Recipe.updateMany(
        { _id: { $in: recipesId } },
        { $unset: { cookbook_id: req.body._id } }
      );
      res.json(recipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
  async deleteRecipes(req, res) {
    try {
      const recipe = await Recipe.findById(req.query[0]);
      const deletedRecipes = await recipeService.deleteRecipes(recipe);
      res.json(deletedRecipes);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
}

module.exports = new RecipeController();
