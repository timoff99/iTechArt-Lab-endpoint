const { Schema, model, Types } = require("mongoose");

const CookBookCollectionSchema = new Schema({
  type: { type: String },
  title: { type: String },
  image: { type: String },
  cloudinary_id: { type: String },
  collection_arr: [{ type: Types.ObjectId, ref: "CookBook" }],
});

module.exports = model("CookBookCollection", CookBookCollectionSchema);
