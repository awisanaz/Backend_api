const express = require("express");
const router = express.Router();
const User = require("./models/user"); // path adjust
require("./db")(); // DB connect

// TEST ROUTE
router.get("/", (req, res) => {
  res.send("API is running...");
});

// LOGIN API
router.post("/api/auth/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();

    // validation
    if (!email || !password) {
      return res.status(400).json({ data: "Email and Password are required", status: "FALSE" });
    }

    // email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ data: "Invalid email format", status: "FALSE" });
    }

    // DATABASE SE USER FETCH
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ data: "No account found with this email", status: "FALSE" });
    }

    // PASSWORD CHECK (plain text for now)
    if (password !== user.password) {
      return res.status(400).json({ data: "Incorrect password", status: "FALSE" });
    }

    // SUCCESS
    return res.status(200).json({ data: "Login successful", status: "TRUE" });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ data: "Internal server error", status: "FALSE" });
  }
});

module.exports = router;
