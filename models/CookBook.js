const { Schema, model, Types } = require("mongoose");

const CookBookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: Buffer, required: true },
  recipes: [{ type: Types.ObjectId, ref: "Recipe" }],
});

module.exports = model("CookBook", CookBookSchema);
