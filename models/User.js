const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  username: { type: String },
  roles: { type: Types.ObjectId, ref: "Role" },
});

module.exports = model("User", UserSchema);