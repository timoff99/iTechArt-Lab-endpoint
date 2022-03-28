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
      const url = req.headers.origin;
      const { email, password } = req.body;
      const token = await authService.login(email, password, url);
      return res.json(token);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new AuthController();
