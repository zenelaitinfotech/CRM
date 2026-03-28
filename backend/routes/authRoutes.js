import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // MySQL connection
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= HELPERS =================
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, location, dob, jobTitle, experience, skills, resumeUrl } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    db.query("SELECT * FROM users WHERE email = $1", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.rows.length > 0) return res.status(400).json({ message: "User already exists" }); // ✅ fix 1: result.rows.length

      const hashedPassword = await bcrypt.hash(password, 10);
      const skillsString = Array.isArray(skills) ? skills.join(",") : null;

      const sql = `
        INSERT INTO users (name, email, password, phone, location, dob, job_title, experience, skills, resume_url, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id
      `; // ✅ fix 2: removed extra comma, added RETURNING id

      db.query(
        sql,
        [name, email, hashedPassword, phone || null, location || null, dob || null, jobTitle || null, experience || null, skillsString, resumeUrl || null, "candidate"],
        (err, result) => {
          if (err) return res.status(500).json({ message: err.message });

          const id = result.rows[0].id; // ✅ fix 3: result.rows[0].id not result.insertId
          const newUser = { id, name, email, role: "candidate" };
          res.status(201).json({ user: newUser, token: generateToken(id) });
        }
      );
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    db.query("SELECT * FROM users WHERE email = $1", [email], async (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.rows.length === 0) return res.status(400).json({ message: "Invalid email or password" }); // ✅ fix 1

      const user = result.rows[0]; // ✅ fix 1
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      res.json({
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user.id),
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// ================= UPDATE PROFILE =================
router.put("/profile-update", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, location, dob, jobTitle, experience, skills, resumeUrl } = req.body;

    const skillsString = Array.isArray(skills) ? skills.join(",") : skills;

    const sql = `
      UPDATE users
      SET name = $1, email = $2, phone = $3, location = $4, dob = $5,
          job_title = $6, experience = $7, skills = $8, resume_url = $9
      WHERE id = $10
    `; // ✅ fix 4: $10 for WHERE id, was $9 (duplicate)

    db.query(sql, [name, email, phone, location, dob, jobTitle, experience, skillsString, resumeUrl, userId], (err) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json({ message: "Profile updated successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN DASHBOARD =================
router.get("/admin-dashboard", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin 👋",
    admin: req.user.name,
  });
});

export default router;