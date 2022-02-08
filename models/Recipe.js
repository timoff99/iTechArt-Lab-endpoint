const { Schema, model, Types } = require("mongoose");

const RecipeSchema = new Schema({
  title: { type: String },
  description: { type: String },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  image: { type: String },
  cloudinary_id: { type: String },
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Recipe", RecipeSchema);
