const User = require("../models/User");

class UserService {
  async getUser(id) {
    return User.findById(id).populate("roles");
  }
}

module.exports = new UserService();
