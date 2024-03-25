const express = require("express");
const router = express.Router();
const { posts } = require("../models");

router.get("/", async (req, res) => {
  try {
    const listOfPosts = await posts.findAll();
    res.json(listOfPosts);
  } catch (err) {
    console.error("Error with res:", error);
    res.status(500).json({ error: "Failed to respond" });
  }
});

router.post("/", async (req, res) => {
  try {
    const post = req.body;
    await posts.create(post);
    res.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
