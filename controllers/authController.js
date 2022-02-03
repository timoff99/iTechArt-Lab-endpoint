const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const generateAccessToken = (id, username, email, roles) => {
  const payload = {
    id,
    username,
    email,
    roles,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

class authController {
  async signup(req, res) {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "error of registration", errors });
      }
      const { email, password } = req.body;
      const tryToFindUser = await User.findOne({ email });
      if (tryToFindUser) {
        return res.status(400).json({ message: "user exists" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const newUser = new User({
        username: email,
        email: email,
        password: hashPassword,
        roles: userRole.value,
      });
      await newUser.save();
      res.json("user successfully registered");
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "registration error", error: e });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: `user ${email} not found` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "wrong password entered" });
      }
      const token = generateAccessToken(user._id, user.email, user.roles);
      res.cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({
        token,
        user: { _id: user._id, email, roles: user.roles },
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "login error" });
    }
  }

  async logout(req, res) {
    try {
      const { token } = req.cookies;
      res.clearCookie("token");
      return res.json({ message: "token deleted", token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "logout error" });
    }
  }

  async getUsers(req, res) {
    try {
      const user = await User.find();
      res.send(user);
    } catch (e) {
      res.status(404);
      res.send({ error: "getUsers error" });
    }
  }
}

module.exports = new authController();
