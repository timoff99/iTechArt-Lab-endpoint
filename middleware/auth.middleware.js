const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    let token;
    if (req.headers.cookie) {
      token = req.headers.cookie.split("=")[1];
    } else {
      token = req.headers.authorization.split(" ")[1];
    }
    if (token === "undefined" && req.url !== "/get-user") {
      return res.status(401).json({ message: "User not authorized" });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    return res.status(403).json({ message: "Error" });
  }
};
