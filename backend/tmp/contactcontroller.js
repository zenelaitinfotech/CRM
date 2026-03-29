// Controllers/contactController.js
import { getContactInfo, saveContactInfo } from "../models/contactModel.js";

export const getContactInfoController = (req, res) => {
  getContactInfo((err, data) => {
    if (err) {
      console.error("Error fetching contact info:", err);
      return res.status(500).json({ error: "Failed to fetch contact info" });
    }
    res.json(data);
  });
};

export const updateContactInfoController = (req, res) => {
  const { email, phone, office_address, off_address } = req.body;

  if (!email || !phone || !office_address || !off_address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  saveContactInfo({ email, phone, office_address, off_address }, (err, result) => {
    if (err) {
      console.error("Error saving contact info:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(result);
  });
};
