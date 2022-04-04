const User = require("../models/User");
const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserController {
  async getAllUsers(req, res) {
    const { order, orderBy } = req.query;
    const allUsers = await userService.getAllUsers(
      req?.query?.status,
      order,
      orderBy
    );
    res.json({ allUsers });
  }

  async getUser(req, res) {
    const user = await userService.getUser(req.user.id);
    return res.json({ user });
  }
  async getUserStatistics(req, res) {
    const allUsersCount = await User.find({}).countDocuments();
    const blockedUsers = await User.find({
      user_status: "blocked",
    }).countDocuments();
    const deletedUsers = await User.find({
      user_status: "deleted",
    }).countDocuments();

    const [countMostActiveCookbookUser] = await User.aggregate([
      {
        $group: {
          _id: null,
          max: { $max: { $size: "$cookbook_id" } },
        },
      },
    ]);
    const [countMostActiveRecipeUser] = await User.aggregate([
      {
        $group: {
          _id: null,
          max: { $max: { $size: "$recipe_id" } },
        },
      },
    ]);

    const mostActiveCookbookUser = await User.find({
      cookbook_id: { $size: countMostActiveCookbookUser.max },
    });

    const mostActiveRecipeUser = await User.find({
      recipe_id: { $size: countMostActiveRecipeUser.max },
    });
    return res.json({
      allUsersCount,
      blockedUsers,
      deletedUsers,
      mostActiveCookbookUser,
      mostActiveRecipeUser,
    });
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

  async updateUserCookBooks(req, res) {
    try {
      const { id } = req.user;
      const { _id } = req.body;
      await User.updateOne({ _id: id }, { $addToSet: { cookbook_id: _id } });
      return res.json("add cookbook_id to user");
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async updateUserRecipes(req, res) {
    try {
      const { id } = req.user;
      const { _id } = req.body;
      await User.updateOne({ _id: id }, { $addToSet: { recipe_id: _id } });
      return res.json("add recipe_id to user");
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async updateUserStatus(req, res) {
    try {
      const { _id, user_status } = req.body;
      await User.updateOne({ _id }, { user_status: user_status });
      return res.json("update user_status");
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async deleteUserCookBookId(req, res) {
    try {
      const { id } = req.user;
      const { _id } = req.body;
      await User.updateOne({ _id: id }, { $pull: { cookbook_id: _id } });
      return res.json("deleted cookbook_id to user");
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async deleteUserRecipeId(req, res) {
    try {
      const { id } = req.user;
      const { _id } = req.body;
      await User.updateOne({ _id: id }, { $pull: { recipe_id: _id } });
      return res.json("deleted recipe_id to user");
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteUser(req, res) {
    try {
      const { _id } = req.query;
      const user = await User.findById(_id);
      const deletedUser = await userService.deleteUser(user);
      res.json(deletedUser);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }

  async resetPass(req, res) {
    try {
      const { newPassword, token } = req.body;
      const user_id = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: user_id.id });
      const hashPassword = bcrypt.hashSync(newPassword, 7);
      user.password = hashPassword;
      user.save();
      res.json({ user });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new UserController();
