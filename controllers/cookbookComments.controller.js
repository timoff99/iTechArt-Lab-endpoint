const cookbookCommentsService = require("../services/cookbookComments.service");

class CookBookCommentsController {
  async createComments(req, res) {
    try {
      const { id } = req.user;
      const { message, id: parent_id } = req.body;
      const newCookbookComment = await cookbookCommentsService.createComments(
        message,
        id,
        parent_id
      );

      return res.json(newCookbookComment);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
module.exports = new CookBookCommentsController();
