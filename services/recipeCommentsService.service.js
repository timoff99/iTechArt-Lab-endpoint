const RecipesComments = require("../models/RecipesComments");

class RecipesCommentsService {
  async createComments(message, id, parent_id) {
    try {
      const createNewCookbookComment = new RecipesComments({
        message,
        user_id: id,
        parent_id,
        time: new Date(),
      });

      const newCookbookComment = await createNewCookbookComment.save();
      return newCookbookComment;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteComments(_id) {
    try {
      const comment = await RecipesComments.findById(_id);
      await comment.remove();
      return true;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new RecipesCommentsService();
