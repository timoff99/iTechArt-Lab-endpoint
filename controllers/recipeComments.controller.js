const recipeCommentsService = require("../services/recipeCommentsService.service");

class RecipeCommentsController {
  async deleteComments(req, res) {
    try {
      const { _id } = req.query;
      const deletedComment = await recipeCommentsService.deleteComments(_id);
      return res.json(deletedComment);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
module.exports = new RecipeCommentsController();
