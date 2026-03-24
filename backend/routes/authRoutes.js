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

    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length > 0) return res.status(400).json({ message: "User already exists" });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      const skillsString = Array.isArray(skills) ? skills.join(",") : null;

      const sql = `
        INSERT INTO users (name, email, password, phone, location, dob, job_title, experience, skills, resume_url, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [name, email, hashedPassword, phone || null, location || null, dob || null, jobTitle || null, experience || null, skillsString, resumeUrl || null, "candidate"],
        (err, result) => {
          if (err) return res.status(500).json({ message: err.message });

          const newUser = { id: result.insertId, name, email, role: "candidate" };
          res.status(201).json({ user: newUser, token: generateToken(result.insertId) });
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

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) return res.status(400).json({ message: "Invalid email or password" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
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
    const userId = req.user.id; // Make sure protect middleware sets req.user.id
    const { name, email, phone, location, dob, jobTitle, experience, skills, resumeUrl } = req.body;

    const skillsString = Array.isArray(skills) ? skills.join(",") : skills;

    const sql = `
      UPDATE users
      SET name = ?, email = ?, phone = ?, location = ?, dob = ?, job_title = ?, experience = ?, skills = ?, resume_url = ?
      WHERE id = ?
    `;

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