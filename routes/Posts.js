const express = require("express");
const router = express.Router();
const { posts, users } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddlewares");

router.get("/", async (req, res) => {
  try {
    const listOfPosts = await posts.findAll();
    res.json(listOfPosts);
  } catch (err) {
    console.error("Error with res:", err);
    res.status(500).json({ error: "Failed to respond" });
  }
});

router.get("/byId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const onePost = await posts.findByPk(id);
    res.json(onePost);
  } catch (err) {
    console.error("Error with gitting one post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.put("/byId/edit/:id", validateToken(["admin"]), async (req, res) => {
  try {
    const id = req.params.id;
    const postEdited = req.body;
    await posts.update(
      {
        title: postEdited.title,
        image: postEdited.image,
        description: postEdited.description,
        content: postEdited.content,
      },
      {
        where: { id: id },
      }
    );

    res.json(postEdited);
  } catch (err) {
    console.error("Error with gitting one post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.post("/", validateToken(["admin"]), async (req, res) => {
  try {
    const post = req.body;
    await posts.create(post);
    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.delete(
  "/byId/delete/:id",
  validateToken(["admin"]),
  async (req, res) => {
    const id = req.params.id;
    try {
      const post = await posts.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: "post not found" });
      }
      await post.destroy(); // Delete the user
      return res.status(204).send(); // No content, successful deletion
    } catch (err) {
      console.error("Error deleting user:", err);
      return res.json({ error: err });
    }
  }
);

module.exports = router;
