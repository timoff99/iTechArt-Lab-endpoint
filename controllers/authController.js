const User = require("../models/User");
const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

class authController {
  async signup(req, res) {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.errors[0].msg,
        });
      }
      const { email, password } = req.body;
      const newUser = await authService.signup(email, password, res);

      return res.json(newUser);
    } catch (e) {
      res.status(400).json({ message: "registration error", error: e });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password, res);

      return res.json(userData);
    } catch (e) {
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
