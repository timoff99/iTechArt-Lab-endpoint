const cookbookCollectionService = require("../services/cookbookCollection.service");

class CookbookCollectionController {
  async getAllCollection(req, res) {
    try {
      const getAllCollection =
        await cookbookCollectionService.getAllCollection();
      return res.json(getAllCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getFourCollection(req, res) {
    try {
      const getFourCollection =
        await cookbookCollectionService.getFourCollection();
      return res.json(getFourCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getOneCollection(req, res) {
    try {
      const { id } = req.query;
      const getOneCollection = await cookbookCollectionService.getOneCollection(
        id
      );
      return res.json(getOneCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async createCollection(req, res) {
    try {
      const { title, image, cloudinary_id, collection } =
        req.body.collectionData;
      const newCollection = await cookbookCollectionService.createCollection(
        title,
        image,
        cloudinary_id,
        collection
      );
      return res.json(newCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async deleteCollection(req, res) {
    try {
      const { collection_id, cloudinary_id } = req.body;
      const deletedCollection =
        await cookbookCollectionService.deleteCollection(
          collection_id,
          cloudinary_id
        );
      return res.json(deletedCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteCollectionFiled(req, res) {
    try {
      const { collection_id, cloudinary_id, collection_filed_id } = req.body;
      const deletedCollectionFiled =
        await cookbookCollectionService.deleteCollectionFiled(
          collection_id,
          cloudinary_id,
          collection_filed_id
        );
      return res.json(deletedCollectionFiled);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}
module.exports = new CookbookCollectionController();
