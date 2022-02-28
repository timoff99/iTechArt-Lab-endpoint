const Recipe = require("../models/Recipe");
const cloudinary = require("../utils/cloudinary");

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
