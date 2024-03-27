const express = require("express");
const router = express.Router();
const { comments } = require("../models");

const { validateToken } = require("../middlewares/AuthMiddlewares");

router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId; // get the post id from the params in the url
    const Comments = await comments.findAll({ where: { PostId: postId } }); // go to the comments table and where the id is postId return all the elments
    res.json(Comments);
  } catch (err) {
    console.error("Error with res:", error);
    res.status(500).json({ error: "Failed to respond" });
  }
});

router.post("/", validateToken(["admin", "user"]), async (req, res) => {
  try {
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;

    await comments.create(comment);
    res.json(comment);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.delete(
  "/:commentId",
  validateToken(["admin", "user"]),
  async (req, res) => {
    const commentId = req.params.commentId;

    const user = req.user.username;
    const role = req.user.role;

    const commentObject = await comments.findOne({ where: { id: commentId } });
    const commentUser = commentObject.username;

    if (role != "admin") {
      if (user != commentUser) {
        return res.json({ error: "not autharized" });
      }
    }

    await comments.destroy({ where: { id: commentId } });

    res.json({ res: "deleted" });
  }
);

module.exports = router;
