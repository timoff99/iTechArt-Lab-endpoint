const { Schema, model, Types } = require("mongoose");

const RecipeCollectionSchema = new Schema({
  type: { type: String },
  title: { type: String },
  image: { type: String },
  cloudinary_id: { type: String },
  collection_arr: [{ type: Types.ObjectId, ref: "Recipe" }],
});

module.exports = model("RecipeCollection", RecipeCollectionSchema);
