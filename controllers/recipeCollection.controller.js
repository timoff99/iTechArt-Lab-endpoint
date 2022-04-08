const recipeCollectionService = require("../services/recipeCollection.service");
const cloudinary = require("../utils/cloudinary");

class RecipeCollectionController {
  async createCollection(req, res) {
    try {
      const { type, title, image, cloudinary_id, collection_arr } = req.body;
      const newCollection = await recipeCollectionService.createCollection(
        type,
        title,
        image,
        cloudinary_id,
        collection_arr
      );
      return res.json(newCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteCollection(req, res) {
    try {
      const { _id, collection_id } = req.body; //body //работает через query
      const deletedCollection = await recipeCollectionService.deleteCollection(
        _id,
        collection_id
      );
      return res.json(deletedCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
module.exports = new RecipeCollectionController();
