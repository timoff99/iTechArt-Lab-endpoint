const Collection = require("../models/RecipeCollection");

class RecipeCollectionService {
  async createCollection(title, image, cloudinary_id, collection_arr) {
    try {
      const createNewCollection = new Collection({
        title,
        image,
        cloudinary_id,
        collection_arr,
      });
      const newCollection = await createNewCollection.save();
      return newCollection;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteCollection(_id, collection_id) {
    try {
      const deletedCollection = await Collection.updateOne({
        _id,
        $pull: { collection_arr: collection_id },
      });

      return deletedCollection;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new RecipeCollectionService();
