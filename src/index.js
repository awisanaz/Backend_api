const express = require("express");
const router = express.Router();
const User = require("./models/user");
require("./db")();

const generateToken = require("./utils/jwt"); // ✅ ADD THIS

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

    if (!email || !password) {
      return res.status(400).json({ data: "Email and Password are required", status: "FALSE" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ data: "No account found", status: "FALSE" });
    }

    // password check (plain for now)
    if (password !== user.password) {
      return res.status(400).json({ data: "Incorrect password", status: "FALSE" });
    }

    // ✅ JWT TOKEN GENERATE
    const token = generateToken(user);

    return res.status(200).json({
      data: "Login successful",
      token: token,
      status: "TRUE"
    });

  } catch (error) {
    return res.status(500).json({ data: "Internal server error", status: "FALSE" });
  }
});

module.exports = router;
