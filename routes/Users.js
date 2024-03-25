const express = require("express");
const router = express.Router();
const { users } = require("../models");

const bcrypt = require("bcrypt");

const { sign } = require("jsonwebtoken");

const { validateToken } = require("../middlewares/AuthMiddlewares");
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      users.create({
        username: username,
        password: hash,
      });
    });
    res.json("success");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await users.findOne({ where: { username: username } });

    if (!user) {
      return res.json({ error: "The user does not exist" });
    }

    bcrypt.compare(password, user.password).then((match) => {
      if (!match) {
        return res.json({ error: "Wrong password" });
      }
      const accessToken = sign(
        { username: user.username, id: user.id },
        "theJWTsecret"
      );
      res.json({ token: accessToken, username: user.username, id: user.id });
      console.log("You have successfully logged in");
    });
  } catch (error) {
    console.error("Error when trying to log in:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

router.get("/auth", validateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
