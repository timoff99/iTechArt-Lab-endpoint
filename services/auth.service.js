const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async signup(email, password) {
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
      roles: userRole,
      status:
        "I don’t know about you but I love pizza. Especially when that pizza comes with Papa John’s very own garlic pizza sticks.",
      image:
        "https://res.cloudinary.com/dipalio-cookbook/image/upload/v1645085466/zt5cdewjoqi57yumfc0r.jpg",
    });

    const newUser = await createNewUser.save();

    const token = this.generateAccessToken(
      newUser._id,
      newUser.username,
      newUser.email,
      newUser.roles,
      newUser.status
    );

    return {
      token,
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email }).populate("roles");
    if (!user) {
      throw new Error(`email ${email} not found`);
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      throw new Error("wrong password entered");
    }
    const token = this.generateAccessToken(
      user._id,
      user.username,
      user.email,
      user.roles,
      user.status
    );
    return {
      token,
    };
  }
  async adminLogin(email, password) {
    const admin = await User.findOne({ email }).populate({
      path: "roles",
      match: { value: { $eq: "ADMIN" } },
    });
    if (!admin) {
      throw new Error(`email ${email} not found`);
    }
    if (!admin.roles) {
      throw new Error(`user don't have such role`);
    }
    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword) {
      throw new Error("wrong password entered");
    }
    const token = this.generateAccessToken(
      admin._id,
      admin.username,
      admin.email,
      admin.roles,
      admin.status
    );
    return {
      token,
    };
  }

  generateAccessToken(id, username, email, roles, status) {
    const payload = {
      id,
      username,
      email,
      roles,
      status,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
  }
}
module.exports = new AuthService();
