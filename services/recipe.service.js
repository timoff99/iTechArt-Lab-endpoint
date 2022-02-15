const Recipe = require("../models/Recipe");
const cloudinary = require("../utils/cloudinary");

class RecipeService {
  async addRecipe(
    title,
    description,
    ingredients,
    steps,
    username,
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
        image: secure_url,
        cloudinary_id: public_id,
        user_id: id,
      });
      return await recipe.save();
    } catch (err) {
      console.log(err);
    }
  }

  async updateRecipeCookBookId(ids, cookbook_id) {
    try {
      const updateRecipe = await Recipe.updateMany(
        { _id: { $in: [ids] } }, // эт ж массив, может просто ids, без []
        { $set: { cookbook_id: cookbook_id } }
      );
      return updateRecipe;
    } catch (err) {
      console.log(err);
    }
  }

  async updateRecipe(recipes, result, req) {
    try {
      const data = {
        title: req.body.title || recipes.title,
        description: req.body.description || recipes.description,
        ingredients: req.body.ingredients || recipes.ingredients,
        steps: req.body.steps || recipes.steps,
        image: result.secure_url || recipes.image,
        cloudinary_id: result.public_id || recipes.cloudinary_id,
        user_id: recipes.user_id,
      };
      const updateRecipe = await Recipe.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      return updateRecipe;
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
