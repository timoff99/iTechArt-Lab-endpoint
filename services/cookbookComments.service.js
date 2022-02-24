const CookBookComments = require("../models/CookBookComments");

class CookBookCommentsService {
  async createComments(message, id, parent_id) {
    try {
      const createNewCookbookComment = new CookBookComments({
        message,
        user_id: id,
        parent_id,
        time: Date.now(),
      });

      const newCookbookComment = await createNewCookbookComment.save();
      return newCookbookComment;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new CookBookCommentsService();
