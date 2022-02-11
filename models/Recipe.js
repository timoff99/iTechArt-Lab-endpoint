const { Schema, model, Types } = require("mongoose");

const RecipeSchema = new Schema({
  title: { type: String },
  description: { type: String },
  ingredients: {
    ingredient: [{ type: String, default: null }],
  },
  steps: {
    step: [{ type: String, default: null }],
  },
  author: { type: String },
  views: { type: Number, default: "11999" },
  likes: { type: Number, default: "499" },
  comments: {
    count: { type: Number, default: "12" },
    message: [{ author: String, text: String, date: String, avatar: Buffer }],
  },
  image: { type: String },
  cloudinary_id: { type: String },
  cookbook_id: { type: Types.ObjectId, ref: "CookBook" },
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Recipe", RecipeSchema);
