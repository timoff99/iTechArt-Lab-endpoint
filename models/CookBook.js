const { Schema, model, Types } = require("mongoose");

const CookBookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  cloudinary_id: { type: String },
  recipes: [{ type: Types.ObjectId, ref: "Recipe" }],
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("CookBook", CookBookSchema);
