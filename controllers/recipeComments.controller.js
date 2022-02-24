const recipeCommentsService = require("../services/recipeCommentsService.service");

class RecipeCommentsController {
  async createComments(req, res) {
    try {
      const { id } = req.user;
      const { message, id: parent_id } = req.body;
      const newRecipeComment = await recipeCommentsService.createComments(
        message,
        id,
        parent_id
      );

      return res.json(newRecipeComment);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
module.exports = new RecipeCommentsController();
