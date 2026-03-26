// Controllers/contactController.js
import db from "../config/db.js";

// GET contact info
export const getContactInfo = (req, res) => {
  db.query("SELECT * FROM contact_info LIMIT 1", (err, results) => {
    if (err) {
      console.error("Error fetching contact info:", err);
      return res.status(500).json({ error: "Failed to fetch contact info" });
    }
    res.json(results[0] || {});
  });
};

// PUT update contact info
export const updateContactInfo = (req, res) => {
  const { email, phone, office_address, off_address } = req.body;

  if (!email || !phone || !office_address || !off_address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query("SELECT id FROM contact_info LIMIT 1", (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      // Update existing row
      db.query(
        "UPDATE contact_info SET email=?, phone=?, office_address=?, off_address=? WHERE id=?",
        [email, phone, office_address, off_address, results[0].id],
        (updateErr) => {
          if (updateErr) {
            console.error("Update error:", updateErr);
            return res.status(500).json({ error: "Failed to update contact info" });
          }
          res.json({ success: true, message: "Contact info updated successfully" });
        }
      );
    } else {
      // Insert first row
      db.query(
        "INSERT INTO contact_info (email, phone, office_address, off_address) VALUES (?,?,?,?)",
        [email, phone, office_address, off_address],
        (insertErr) => {
          if (insertErr) {
            console.error("Insert error:", insertErr);
            return res.status(500).json({ error: "Failed to create contact info" });
          }
          res.json({ success: true, message: "Contact info created successfully" });
        }
      );
    }
  });
};
