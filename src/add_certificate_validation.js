const express = require("express");
const app = express();
app.use(express.json());
const searchRoutes = require("./search");


let certificates = [];
app.locals.certificates = certificates;


// Helper for empty check
const isEmpty = v => !v || v.toString().trim() === "";

// Add Certificate
app.post("/api/certificate/add", (req, res) => {
    const required = [
        "name", "courseType", "joiningDate", 
        "completedDate", "validDate", "totalMark", 
        "certificateSerial"
    ];

    // Check missing fields
    for (let field of required) {
        if (isEmpty(req.body[field])) {
            return res.status(400).json({ data: `${field} is required` });
        }
    }

    const { name, courseType, joiningDate, completedDate, validDate, totalMark, certificateSerial } = req.body;

    // Alphabets only
    const alpha = /^[A-Za-z ]+$/;
    if (!alpha.test(name) || !alpha.test(courseType))
        return res.status(400).json({ data: "Name & Course Type must contain only alphabets" });

    // Date validations
    if ([joiningDate, completedDate, validDate].some(d => isNaN(Date.parse(d))))
        return res.status(400).json({ data: "Invalid date format" });

    // Number validation
    if (isNaN(totalMark))
        return res.status(400).json({ data: "Total Mark must be a number" });

    // Serial number validation
if (!/^[0-9]+$/.test(certificateSerial)) {
    return res.status(400).json({ data: "Certificate Serial must contain only numbers" });
}

if (!/^[0-9]{6}$/.test(certificateSerial)) {
    return res.status(400).json({ data: "Certificate Serial must be exactly 6 digits" });
}

    // Save
    certificates.push({
        id: certificates.length + 1,
        ...req.body
    });

    res.json({ data: "Certificate added successfully....." });
});

// All Certificates
app.get("/api/view/list", (req, res) => {
    res.json({ data: certificates });
});

// Single Certificate
app.get("/api/view/:id", (req, res) => {
    const cert = certificates.find(c => c.id == req.params.id);
    if (!cert) return res.status(404).json({ data: "Certificate not found" });
    res.json({ data: cert });
});

// Delete Certificate
app.delete("/api/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = certificates.findIndex(c => c.id === id);

    if (index === -1) {
        return res.status(404).json({ data: "Certificate not found" });
    }

    certificates.splice(index, 1); // Remove from array
    res.json({ data: "Certificate deleted successfully" });
});

// Update Certificate
app.put("/api/update/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const cert = certificates.find(c => c.id === id);

    if (!cert) return res.status(404).json({ data: "Certificate not found" });

    const { name, courseType, joiningDate, completedDate, validDate, totalMark, certificateSerial } = req.body;

    // Optional: same validation as POST
    if (name && !/^[A-Za-z ]+$/.test(name)) 
        return res.status(400).json({ data: "Name must contain only alphabets" });

    if (courseType && !/^[A-Za-z ]+$/.test(courseType))
        return res.status(400).json({ data: "Course Type must contain only alphabets" });

    if (joiningDate && isNaN(Date.parse(joiningDate)) ||
        completedDate && isNaN(Date.parse(completedDate)) ||
        validDate && isNaN(Date.parse(validDate))) {
        return res.status(400).json({ data: "Invalid date format" });
    }

    if (totalMark && isNaN(totalMark))
        return res.status(400).json({ data: "Total Mark must be a number" });

    if (certificateSerial && (!/^[0-9]{6}$/.test(certificateSerial)))
        return res.status(400).json({ data: "Certificate Serial must be exactly 6 digits" });

    // Update values
    Object.assign(cert, req.body);

    res.json({ data: "Certificate updated successfully", certificate: cert });
});


app.use("/api/user", searchRoutes);

// Server
app.listen(3000, () => console.log("Server running on port 3000"));
