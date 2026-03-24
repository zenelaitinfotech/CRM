import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Candidateuser.js";
import Application from "../models/Application.js";
import db from "../config/db.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, location } = req.body;

    // Check if email exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Database error" });
      if (results.length > 0) return res.status(400).json({ message: "Email already exists" });

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Insert user
      const insertQuery = `
        INSERT INTO users (name, email, password, phone, location)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertQuery, [name, email, hashed, phone, location], (err, result) => {
        if (err) return res.status(500).json({ message: "Database insert error" });

        // Generate token
        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET);

        res.json({ token, user: { id: result.insertId, name, email, phone, location } });
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({ token, user });
  });
});


router.get("/applications", async (req, res) => {
  const query = `
    SELECT a.id AS application_id, a.cover_letter, a.expected_salary,
           j.id AS job_id, j.title AS job_title, j.company AS company,
           u.id AS candidate_id, u.name AS candidate_name, u.email AS candidate_email
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.candidate_id = u.id
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

export default router;