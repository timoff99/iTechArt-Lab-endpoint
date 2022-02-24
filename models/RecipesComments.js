const { Schema, model, Types } = require("mongoose");

const RecipesCommentsSchema = new Schema({
  message: { type: String },
  time: { type: Date },
  user_id: { type: Types.ObjectId, ref: "User" },
  parent_id: { type: Types.ObjectId, ref: "Recipe" },
});

module.exports = model("RecipesComments", RecipesCommentsSchema);
