const express = require("express");
const router = express.Router();
const CertiData = require("./models/CertiData");
const authMiddleware = require("./middleware/authMiddleware");

// Helper
const isEmpty = v => !v || v.toString().trim() === "";

// ======================== ADD CERTIFICATE ========================
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const required = [
      "name", "courseType", "joiningDate",
      "completedDate", "validDate", "totalMark",
      "certificateSerial"
    ];

    for (let field of required) {
      if (isEmpty(req.body[field])) {
        return res.status(400).json({ data: `${field} is required` });
      }
    }

    const { name, courseType, joiningDate, completedDate, validDate, totalMark, certificateSerial } = req.body;

    if (!/^[A-Za-z ]+$/.test(name) || !/^[A-Za-z ]+$/.test(courseType)) {
      return res.status(400).json({ data: "Name & Course Type must contain only alphabets" });
    }

    if ([joiningDate, completedDate, validDate].some(d => isNaN(Date.parse(d)))) {
      return res.status(400).json({ data: "Invalid date format" });
    }

    if (isNaN(totalMark)) {
      return res.status(400).json({ data: "Total Mark must be a number" });
    }

    if (!/^[0-9]{6}$/.test(certificateSerial)) {
      return res.status(400).json({ data: "Certificate Serial must be exactly 6 digits" });
    }

    // ✅ DATABASE STORE
    const cert = await CertiData.create(req.body);

    res.status(201).json({ data: "Certificate added successfully", certificate: cert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== VIEW ALL CERTIFICATES ========================
router.get("/view/list",  authMiddleware, async (req, res) => {
  try {
    const certificates = await CertiData.find();
    res.json({ data: certificates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== VIEW ONE CERTIFICATE ========================
router.get("/view/:id",  authMiddleware, async (req, res) => {
  try {
    const cert = await CertiData.findById(req.params.id);
    if (!cert) {
      return res.status(404).json({ data: "Certificate not found" });
    }
    res.json({ data: cert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== DELETE CERTIFICATE ========================
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const cert = await CertiData.findByIdAndDelete(req.params.id);
    if (!cert) {
      return res.status(404).json({ data: "Certificate not found" });
    }
    res.json({ data: "Certificate deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================== UPDATE CERTIFICATE ========================
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const cert = await CertiData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!cert) {
      return res.status(404).json({ data: "Certificate not found" });
    }

    res.json({ data: "Certificate updated successfully", certificate: cert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
