const mailService = require("../services/mail.service");
const User = require("../models/User");

class MailController {
  async sendForgotPasswordMail(req, res) {
    try {
      const { to } = req.body;
      const user = await User.findOne({ email: to });

      const send = await mailService.sendForgotPasswordMail(to, user);
      res.json(send);
    } catch (e) {
      return res.status(400).json({
        message: e.message,
      });
    }
  }
}

module.exports = new MailController();
