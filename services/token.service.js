const jwt = require("jsonwebtoken");
const generateAccessToken = (id, username, email, roles) => {
  const payload = {
    id,
    username,
    email,
    roles,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

module.exports = { generateAccessToken };
