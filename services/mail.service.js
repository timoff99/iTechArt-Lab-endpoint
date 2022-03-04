const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class mailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendForgotPasswordMail(to, user) {
    try {
      const token = this.generateAccessToken(user._id);
      const send = await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: `Hello ✔ from ${process.env.API_URL}`,
        text: "Hello world?",
        html: ` <div>
            <h1>Для восстановления пароля перейдите по ссылке</h1>
            <a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a>
          </div>`,
      });

      return send;
    } catch (err) {
      console.log(err);
    }
  }
  generateAccessToken(id) {
    const payload = {
      id,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  }
}
module.exports = new mailService();
