const cookbookCommentsService = require("../services/cookbookComments.service");

class CookBookCommentsController {
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
