const { Schema, model, Types } = require("mongoose");

const CookBookCommentsSchema = new Schema({
  message: { type: String },
  time: { type: Date },
  user_id: { type: Types.ObjectId, ref: "User" },
  parent_id: { type: Types.ObjectId, ref: "CookBook" },
});

module.exports = model("CookBookComments", CookBookCommentsSchema);
