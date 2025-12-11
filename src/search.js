const express = require("express");
const router = express.Router();

router.get("/search", (req, res) => {
    const certificates = req.app.locals.certificates;

    const { certificateSerial, name, courseType } = req.query;

    // Starting point of results = all certificates
    let results = certificates;

    // 🔹 1) Filter by Course Type (select box)
    if (courseType && courseType.trim() !== "") {
        const typeLower = courseType.toLowerCase().trim();
        results = results.filter(
            c => c.courseType.toLowerCase() === typeLower
        );
    }

    // 🔹 2) Filter by Certificate Serial (input)
    if (certificateSerial && certificateSerial.trim() !== "") {
        if (!/^[0-9]{6}$/.test(certificateSerial)) {
            return res.status(400).json({ 
                data: "Certificate Serial must be exactly 6 digits" 
            });
        }

        results = results.filter(
            c => c.certificateSerial === certificateSerial
        );
    }

    // 🔹 3) Filter by Name (input)
    if (name && name.trim() !== "") {
        const lowerName = name.toLowerCase().trim();
        results = results.filter(
            c => c.name.toLowerCase().includes(lowerName)
        );
    }

    // If still no result
    if (!results || results.length === 0) {
        return res.status(404).json({ data: "No matching certificate found" });
    }

    return res.json({ data: results });
});

module.exports = router;
