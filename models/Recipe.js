const { Schema, model } = require("mongoose");

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  ingredients: [{ type: String }],
  steps: [{ type: String }],
  image: { type: Buffer, required: true },
});

module.exports = model("Recipe", RecipeSchema);
