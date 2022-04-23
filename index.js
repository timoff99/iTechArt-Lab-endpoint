require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
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

const CookBookComments = require("./models/CookBookComments");
const RecipesComments = require("./models/RecipesComments");
const CookBook = require("./models/CookBook");
const Recipe = require("./models/Recipe");

const PORT = process.env.PORT || 5000;
const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  },
});

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
    server.listen(PORT, () =>
      console.log(`server has been started on port ${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
  let room;
  socket.on("join:room", (roomId) => {
    socket.join(roomId);
    room = roomId;
    console.log(`User with ID ${socket.id} joined room: ${roomId}`);
  });

  socket.on("leave:room", (roomId) => {
    console.log(`User with ID ${socket.id} leave room: ${roomId}`);
    socket.leave(roomId);
  });

  socket.on(
    "comment:send",
    async ({ message, user_id, parent_id, flag = "cookbook" }) => {
      let data;
      if (flag === "cookbook") {
        const createNewCookbookComment = new CookBookComments({
          message,
          parent_id,
          user_id,
          time: new Date(),
        });
        const newCookbookComment = await createNewCookbookComment.save();
        const updatedCookBook = await CookBook.findOneAndUpdate(
          { _id: parent_id },
          {
            $push: { comments: newCookbookComment._id },
          }
        );

        data = await CookBook.findByIdAndUpdate({ _id: parent_id })
          .populate("recipes")
          .populate({
            path: "comments",
            populate: {
              path: "user_id",
            },
          });
      } else {
        const createNewRecipeComment = new RecipesComments({
          message,
          parent_id,
          user_id,
          time: new Date(),
        });

        const newRecipeComment = await createNewRecipeComment.save();
        const updatedRecipe = await Recipe.findOneAndUpdate(
          { _id: parent_id },
          {
            $push: { comments: newRecipeComment._id },
          }
        );

        data = await Recipe.findByIdAndUpdate({ _id: parent_id }).populate({
          path: "comments",
          populate: {
            path: "user_id",
          },
        });
      }
      io.to(room).emit("comment_receive", data);
    }
  );
  socket.on("user:typing", (nikName) => {
    socket.broadcast.to(room).emit("user:typing", nikName);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});
