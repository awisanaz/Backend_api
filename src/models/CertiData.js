const mongoose = require("mongoose");

// Schema definition
const certiSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courseType: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  completedDate: { type: Date, required: true },
  validDate: { type: Date, required: true },
  totalMark: { type: Number, required: true },
  certificateSerial: { type: String, required: true, unique: true }
}, {
  collection: "Data" // MongoDB collection name
});

// Model export
module.exports = mongoose.model("CertiData", certiSchema);
