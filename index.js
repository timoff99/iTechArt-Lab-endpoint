require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRouter = require("./router/auth.router");
const roleRouter = require("./router/role.router");
const userRouter = require("./router/user.router");
const auth = require("./middleware/auth.middleware");
const recipeRouter = require("./router/recipe.router");
const cookBookRouter = require("./router/cookbook.router");
const imageRouter = require("./router/image.router");
const cookbookCommentsRouter = require("./router/cookbookComments.router");
const recipeCommentsRouter = require("./router/recipeComments.router");
const mail = require("./router/mail.router");
const cookbookCollectionRouter = require("./router/cookbookCollection.router");
const recipeCollectionRouter = require("./router/recipeCollection.router");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  })
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/role", roleRouter);
app.use("/api/user", userRouter);
app.use("/api/recipe", recipeRouter);
app.use("/api/cookbook", cookBookRouter);
app.use("/api/image", imageRouter);
app.use("/api/cookbook-comments", auth, cookbookCommentsRouter);
app.use("/api/recipe-comments", auth, recipeCommentsRouter);
app.use("/api/mail", mail);
app.use("/api/cookbook-collection", cookbookCollectionRouter);
app.use("/api/recipe-collection", recipeCollectionRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () =>
      console.log(`server has been started on port ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
