const { Schema, model, Types } = require("mongoose");

const CookBookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String },
  views: { type: Number, default: "12000" },
  likes: [{ type: Types.ObjectId, ref: "User", default: [1] }],
  types: [{ type: String }],
  image: { type: String },
  cloudinary_id: { type: String },
  recipes: [{ type: Types.ObjectId, ref: "Recipe" }],
  comments: [{ type: Types.ObjectId, ref: "CookBookComments" }],
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("CookBook", CookBookSchema);
