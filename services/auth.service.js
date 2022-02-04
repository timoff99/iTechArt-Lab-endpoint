const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require("../services/token.service");

class AuthService {
  async signup(email, password, res) {
    const tryToFindUser = await User.findOne({ email });
    if (tryToFindUser) {
      throw new Error("user exists");
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const userRole = await Role.findOne({ value: "USER" });
    const createNewUser = new User({
      username: "user",
      email: email,
      password: hashPassword,
      roles: userRole.value,
    });

    const newUser = await createNewUser.save();

    const token = generateAccessToken(
      newUser._id,
      newUser.username,
      newUser.email,
      newUser.roles
    );

    return {
      message: "user successfully registered",
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: newUser.roles,
      },
    };
  }
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error(`email ${email} not found`);
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      throw new Error("wrong password entered");
    }
    const token = generateAccessToken(
      user._id,
      user.username,
      user.email,
      user.roles
    );
    return {
      message: "user successfully login",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email,
        roles: user.roles,
      },
    };
  }
}
module.exports = new AuthService();
