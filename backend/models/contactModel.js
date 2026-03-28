// models/contactModel.js
import db from "../config/db.js";

// Get contact info (first row)
export const getContactInfo = (callback) => {
  db.query("SELECT * FROM contact_info LIMIT 1", (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.rows[0] || {});
  });
};

// Save (update or insert) contact info
export const saveContactInfo = (contact, callback) => {
  const { email, phone, office_address, off_address } = contact;

  db.query("SELECT id FROM contact_info LIMIT 1", (err, results) => {
    if (err) return callback(err);

    if (results.length > 0) {
      // Update existing row
      db.query(
        "UPDATE contact_info SET email=$1, phone=$2, office_address=$3, off_address=$4 WHERE id=$5",
        [email, phone, office_address, off_address, results.rows[0].id],
        (updateErr) => {
          if (updateErr) return callback(updateErr);
          callback(null, { success: true, message: "Contact info updated" });
        }
      );
    } else {
      // Insert new row
      db.query(
        "INSERT INTO contact_info (email, phone, office_address, off_address) VALUES ($1,$2,$3,$4)",
        [email, phone, office_address, off_address],
        (insertErr) => {
          if (insertErr) return callback(insertErr);
          callback(null, { success: true, message: "Contact info created" });
        }
      );
    }
  });
};
