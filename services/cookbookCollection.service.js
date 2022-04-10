const Collection = require("../models/CookBookCollection");
const cloudinary = require("../utils/cloudinary");

class CookbookCollectionService {
  async getAllCollection() {
    try {
      return await Collection.find({});
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getOneCollection(id) {
    try {
      return await Collection.findOne({ _id: id }).populate("collection_arr");
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

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

  async deleteCollection(collection_id, cloudinary_id) {
    try {
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }
      const deletedCollectionFiled = await Collection.deleteOne({
        collection_id,
      });

      return deletedCollectionFiled;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteCollectionFiled(collection_id, collection_filed_id) {
    try {
      const deletedCollectionFiled = await Collection.updateOne({
        collection_id,
        $pull: { collection_arr: collection_filed_id },
      });

      return deletedCollectionFiled;
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new CookbookCollectionService();
