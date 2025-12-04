const express = require("express");
const app = express();

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// LOGIN API (POST)
app.post("/api/auth/login", (req, res) => {
  let { email, password } = req.body;

  // Trim values
  email = email?.trim();
  password = password?.trim();

  // 1️⃣ CHECK EMPTY FIELDS
  if (!email || !password) {
    return res.status(400).json({ data: "Email and Password are required" });
  }

  // 2️⃣ EMAIL FORMAT VALIDATION
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ data: "Invalid email format" });
  }

  // Dummy user (as existing user)
  const dummyUser = {
    email: "test@gmail.com",
    password: "Password@123"
  };

  // 3️⃣ EMAIL EXISTENCE CHECK
  if (email !== dummyUser.email) {
    return res.status(400).json({
      data: "No account found with this email. Please enter a registered email.",
      status: "FALSE"
    });
  }

  // 4️⃣ PASSWORD MATCH CHECK
  if (password !== dummyUser.password) {
    return res.status(400).json({
      data: "Incorrect password. Please try again.",
      status: "FALSE"
    });
  }

  // SUCCESS
  res.json({
    data: "Login successful",
    status: "TRUE"
});
});

// SERVER

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
