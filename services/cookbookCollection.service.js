const Collection = require("../models/CookBookCollection");
const cloudinary = require("../utils/cloudinary");

class CookbookCollectionService {
  async getAllCollection() {
    try {
      return await Collection.find({});
    } catch (err) {
      console.log(err);
    }
  }

  async getFourCollection() {
    try {
      return await Collection.find({}).limit(4);
    } catch (err) {
      console.log(err);
    }
  }

  async getOneCollection(id) {
    try {
      return await Collection.findOne({ _id: id }).populate("collection_arr");
    } catch (err) {
      console.log(err);
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
    } catch (err) {
      console.log(err);
    }
  }

  async deleteCollection(collection_id, cloudinary_id) {
    try {
      if (cloudinary_id) {
        await cloudinary.uploader.destroy(cloudinary_id);
      }
      const deletedCollection = await Collection.findOneAndDelete({
        _id: collection_id,
      });

      return deletedCollection;
    } catch (err) {
      console.log(err);
    }
  }
  async deleteCollectionFiled(
    collection_id,
    cloudinary_id,
    collection_filed_id
  ) {
    try {
      const [CollectionFiledsCount] = await Collection.find({
        _id: collection_id,
      });
      if (CollectionFiledsCount.collection_arr.length <= 1) {
        await cloudinary.uploader.destroy(cloudinary_id);
        const deletedCollectionFiled = await Collection.findOneAndDelete({
          _id: collection_id,
        });
        return deletedCollectionFiled;
      }
      return await Collection.updateOne(
        { _id: collection_id },
        { $pull: { collection_arr: collection_filed_id } }
      );
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new CookbookCollectionService();
