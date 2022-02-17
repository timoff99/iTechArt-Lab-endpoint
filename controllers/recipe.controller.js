const Recipe = require("../models/Recipe");
const recipeService = require("../services/recipe.service");
const cloudinary = require("../utils/cloudinary");

class RecipeController {
  async addRecipe(req, res) {
    try {
      const { title, description, ingredients, steps, image } = req.body;
      const { id, username } = req.user;
      const { secure_url, public_id } = image;
      const recipe = await recipeService.addRecipe(
        title,
        description,
        ingredients,
        steps,
        username,
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
      const recipes = await Recipe.find({ user_id: req.user.id });
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
      );
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
      const recipes = await Recipe.findById(req.query._id);
      await cloudinary.uploader.destroy(recipes.cloudinary_id);
      const result = await cloudinary.uploader.upload(req.file.path);
      const updateRecipe = await recipeService.updateRecipe(
        recipes,
        result,
        req
      );
      res.json(updateRecipe);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async deleteRecipes(req, res) {
    try {
      const recipe = await Recipe.findById(req.query._id);
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
