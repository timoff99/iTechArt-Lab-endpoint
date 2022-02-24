const { Schema, model, Types } = require("mongoose");

const RecipeSchema = new Schema({
  title: { type: String },
  description: { type: String },
  ingredients: [{ type: String, default: "milk" }],
  steps: [{ type: String, default: "add milk" }],
  author: { type: String },
  views: { type: Number, default: "11999" },
  likes: [{ type: Types.ObjectId, ref: "User", default: [1] }],
  cooking_time: { type: Number },
  image: { type: String },
  cloudinary_id: { type: String },
  cookbook_id: { type: Types.ObjectId, ref: "CookBook" },
  comments: [{ type: Types.ObjectId, ref: "RecipesComments" }],
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Recipe", RecipeSchema);
