const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const { generateAccessToken } = require("../services/token.service");

class AuthService {
  async signup(email, password, res) {
    const tryToFindUser = await User.findOne({ email });
    if (tryToFindUser) {
      return res.status(400).json({ message: "user exists" });
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const userRole = await Role.findOne({ value: "USER" });
    const createNewUser = new User({
      username: email,
      email: email,
      password: hashPassword,
      roles: userRole.value,
    });

    const newUser = await createNewUser.save();

    const token = generateAccessToken(
      newUser._id,
      newUser.email,
      newUser.roles
    );

    return {
      message: "user successfully registered",
      token,
      user: { _id: newUser._id, email: newUser.email, roles: newUser.roles },
    };
  }
  async login(email, password, res) {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: `email ${email} not found` });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "wrong password entered" });
    }
    const token = generateAccessToken(user._id, user.email, user.roles);
    return {
      message: "user successfully login",
      token,
      user: { _id: user._id, email, roles: user.roles },
    };
  }
}
module.exports = new AuthService();
