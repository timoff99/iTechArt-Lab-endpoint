const User = require("../models/User");
const { validationResult } = require("express-validator");
const authService = require("../services/auth.service");

class AuthController {
  async signup(req, res) {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.errors[0].msg,
        });
      }
      const { email, password } = req.body;
      const newUser = await authService.signup(email, password);
      return res.json(newUser);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);
      return res.json(userData);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async logout(req, res) {
    try {
      const { token } = req.cookies;
      res.clearCookie("token");
      return res.json({ message: "token deleted", token });
    } catch (e) {
      res.status(400).json({ message: "logout error" });
    }
  }
}

module.exports = new AuthController();
