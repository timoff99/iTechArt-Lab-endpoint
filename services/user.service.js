const User = require("../models/User");
const bcrypt = require("bcryptjs");

class UserService {
  async getAllUsers(search, status, order, orderBy) {
    const descendingComparator = (a, b, orderBy) => {
      if (orderBy === "cookbook_id" || orderBy === "recipe_id") {
        if (b[orderBy].length < a[orderBy].length) {
          return -1;
        }
        if (b[orderBy].length > a[orderBy].length) {
          return 1;
        }
        return 0;
      }
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    };

    const getComparator = (order, orderBy) => {
      return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
          return order;
        }
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    };
    let allUsers;
    if (status) {
      allUsers = await User.find({
        username: { $regex: search, $options: "i" },
        user_status: status,
      });
    } else {
      allUsers = await User.find({
        username: { $regex: search, $options: "i" },
      });
    }
    return stableSort(allUsers, getComparator(order, orderBy));
  }

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

  async deleteUser(user) {
    try {
      await cloudinary.uploader.destroy(user.cloudinary_id);
      await user.remove();
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new UserService();
