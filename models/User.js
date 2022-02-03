const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String, require: true },
  password: { type: String, require: true },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", UserSchema);
