const { Schema, model, Types } = require("mongoose");

const CookBookSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: String },
  views: { type: Number, default: "12000" },
  likes: { type: Number, default: "499" },
  comments: {
    count: { type: Number, default: "12" },
    message: [{ author: String, text: String, date: String, avatar: Buffer }],
  },
  image: { type: String },
  cloudinary_id: { type: String },
  recipes: [{ type: Types.ObjectId, ref: "Recipe" }],
  user_id: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("CookBook", CookBookSchema);
