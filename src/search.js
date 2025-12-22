const express = require("express");
const router = express.Router();
const CertiData = require("./models/CertiData");

// ======================== SEARCH CERTIFICATE ========================
router.get("/search", async (req, res) => {
  try {
    const { certificateSerial, name, courseType } = req.query;

    let query = {};

    // 🔎 Course Type Search
    if (courseType) {
      query.courseType = {
        $regex: `^${courseType.trim()}$`,
        $options: "i"   // case-insensitive
      };
    }

    // 🔎 Certificate Serial Search
    if (certificateSerial) {
      if (!/^[0-9]{6}$/.test(certificateSerial)) {
        return res.status(400).json({
          data: "Certificate Serial must be exactly 6 digits"
        });
      }
      query.certificateSerial = certificateSerial;
    }

    // 🔎 Name Search (partial match)
    if (name) {
      query.name = {
        $regex: name.trim(),
        $options: "i"
      };
    }

    const results = await CertiData.find(query);

    if (results.length === 0) {
      return res.status(404).json({
        data: "No matching certificate found"
      });
    }

    res.json({ data: results });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
