const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
  username: { type: String },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", UserSchema);
