const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  {
    collection: "my_website"   // 👈 VERY IMPORTANT
  }
);

module.exports = mongoose.model("User", userSchema);
