const User = require("../models/User");
const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");

class UserController {
  async getUser(req, res) {
    const user = await userService.getUser(req.user.id);
    return res.json({ user });
  }

  async updateUser(req, res) {
    try {
      const { id } = req.user;
      let { updatedFiled } = req.body;
      if (updatedFiled.oldPassword) {
        updatedFiled = await userService.updateUserPassword(id, updatedFiled);
      }
      const updateUser = await User.findByIdAndUpdate(id, updatedFiled, {
        new: true,
      });
      return res.json({ updateUser });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new UserController();
