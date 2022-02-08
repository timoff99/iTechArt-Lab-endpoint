const Recipe = require("../models/Recipe");
const cloudinary = require("../utils/cloudinary");

class RecipeService {
  async addRecipe(
    title,
    description,
    ingredients,
    status,
    secure_url,
    public_id,
    id
  ) {
    try {
      const recipe = new Recipe({
        title,
        description,
        ingredients,
        status,
        image: secure_url,
        cloudinary_id: public_id,
        user_id: id,
      });
      return await recipe.save();
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
