const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// ROUTES
app.use("/", require("./index"));
app.use("/api/certificate", require("./add_certificate_validation"));
app.use("/api/user", require("./search"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
