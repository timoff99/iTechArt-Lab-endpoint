const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  username: { type: String },
  status: { type: String },
  roles: { type: Types.ObjectId, ref: "Role" },
  image: { type: String },
  cloudinary_id: { type: String },
  user_status: { type: String },
  cookbook_id: [{ type: Types.ObjectId, ref: "CookBook" }],
  recipe_id: [{ type: Types.ObjectId, ref: "Recipe" }],
});

module.exports = model("User", UserSchema);
