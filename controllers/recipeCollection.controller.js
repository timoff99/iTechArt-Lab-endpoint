const recipeCollectionService = require("../services/recipeCollection.service");

class RecipeCollectionController {
  async getAllCollection(req, res) {
    try {
      const getAllCollection = await recipeCollectionService.getAllCollection();
      return res.json(getAllCollection);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async getOneCollection(req, res) {
    try {
      const { id } = req.query;
      const getOneCollection = await recipeCollectionService.getOneCollection(
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
      const newCollection = await recipeCollectionService.createCollection(
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
      const deletedCollection = await recipeCollectionService.deleteCollection(
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
        await recipeCollectionService.deleteCollectionFiled(
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
module.exports = new RecipeCollectionController();
