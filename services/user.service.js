const User = require("../models/User");
const bcrypt = require("bcryptjs");

class UserService {
  async getUser(id) {
    return User.findById(id).populate("roles");
  }

  async updateUserPassword(id, updatedFiled) {
    const currentUser = await User.findOne({ _id: id }).populate("roles");
    const validPassword = bcrypt.compareSync(
      updatedFiled.oldPassword,
      currentUser.password
    );
    if (!validPassword) {
      throw new Error("wrong password entered");
    }
    const hashPassword = bcrypt.hashSync(updatedFiled.newPassword, 7);
    return (updatedFiled = { password: hashPassword });
  }
}

module.exports = new UserService();
