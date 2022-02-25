const { Schema, model, Types } = require("mongoose");

const RecipeSchema = new Schema({
  title: { type: String },
  description: { type: String },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  author: { type: String },
  views: { type: Number },
  likes: [{ type: Types.ObjectId, ref: "User" }],
  cooking_time: { type: Number },
  image: { type: String },
  cloudinary_id: { type: String },
  cookbook_id: { type: Types.ObjectId, ref: "CookBook" },
  comments: [{ type: Types.ObjectId, ref: "RecipesComments" }],
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Recipe", RecipeSchema);
