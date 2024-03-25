const express = require("express");
const router = express.Router();
const { users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");

const isPasswordStrong = (password) => {
  // Define criteria for a strong password (e.g., minimum length, presence of special characters, etc.)
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  // Check if password meets all criteria
  const isValid =
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars;

  // Prepare error message
  let errorMessage = "Password must contain:";
  if (password.length < minLength) {
    errorMessage += " at least 8 characters,";
  }
  if (!hasUpperCase) {
    errorMessage += " at least one uppercase letter,";
  }
  if (!hasLowerCase) {
    errorMessage += " at least one lowercase letter,";
  }
  if (!hasNumbers) {
    errorMessage += " at least one number,";
  }
  if (!hasSpecialChars) {
    errorMessage += " at least one special character,";
  }
  errorMessage = errorMessage.slice(0, -1); // Remove trailing comma

  return { isValid, errorMessage };
};

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await users.findOne({ where: { username: username } });
    if (existingUser) {
      return res.json({ error: "Username already exists" });
    }

    // Check if the password is strong
    const { isValid, errorMessage } = isPasswordStrong(password);
    if (!isValid) {
      return res.status(400).json({ error: errorMessage });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await users.create({
      username: username,
      password: hashedPassword,
    });

    res.json("success");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: `Failed to create user: ${error.message}` });
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
        { username: user.username, id: user.id, role: user.role },
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

router.get("/auth", (req, res) => {
  res.json(req.user);
});

module.exports = router;
