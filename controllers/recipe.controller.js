const Recipe = require("../models/Recipe");
const recipeService = require("../services/recipe.service");
const cloudinary = require("../utils/cloudinary");

class RecipeController {
  async addRecipe(req, res) {
    try {
      const { title, description, ingredients, status } = req.body;
      const { id } = req.user;
      const result = await cloudinary.uploader.upload(req.file.path);
      const { secure_url, public_id } = result;
      const recipe = await recipeService.addRecipe(
        title,
        description,
        ingredients,
        status,
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

  async getRecipes(req, res) {
    try {
      const recipes = await Recipe.find({ user_id: req.user.id });
      res.json(recipes);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async deleteRecipes(req, res) {
    try {
      const recipe = await Recipe.findById(req.params.id);
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
