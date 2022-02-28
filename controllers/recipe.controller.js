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

  async getAllRecipes(req, res) {
    try {
      const recipes = await Recipe.find();
      res.json(recipes);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async getUserRecipes(req, res) {
    try {
      const recipes = await Recipe.find({ user_id: req.user.id }).populate(
        "comments"
      );
      res.json(recipes);
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

  async getFilteredRecipes(req, res) {
    try {
      const timeRange = req.query;
      if (timeRange) {
        const recipe = await Recipe.find({
          cooking_time: { $gte: timeRange[0], $lte: timeRange[1] },
        }).populate("comments");
        res.json(recipe);
      } else {
        const recipe = await Recipe.find({}).populate("comments");
        res.json(recipe);
      }
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
        console.log("delete image");
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
