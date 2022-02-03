const { Schema, model } = require("mongoose");

const CookBookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: Buffer, required: true },
  recipes: [{ type: String, ref: "Recipe" }],
});

module.exports = model("CookBook", CookBookSchema);
