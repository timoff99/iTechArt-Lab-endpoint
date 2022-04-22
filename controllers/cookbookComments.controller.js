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

  async deleteComments(req, res) {
    try {
      const { _id } = req.query;
      const deletedComment = await cookbookCommentsService.deleteComments(_id);
      return res.json(deletedComment);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
module.exports = new CookBookCommentsController();
