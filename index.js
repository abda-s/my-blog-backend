const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

//Routers
const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const UsersRouter = require("./routes/Users");
app.use("/auth", UsersRouter);

const CommentsRouter = require("./routes/Comments");
app.use("/comments", CommentsRouter);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
});
