require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./router/authRouter");
const roleRouter = require("./router/role.router");
const userRouter = require("./router/user.router");
const auth = require("./middleware/authMiddleware")

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/role", roleRouter);
app.use("/api/user", auth, userRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => console.log(`server has been started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
