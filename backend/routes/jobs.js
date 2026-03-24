import express from "express";
import db from "../config/db.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= APPLY TO JOB =================
router.post("/:jobId/apply", protect, async (req, res) => {
  try {
    const { coverLetter, expectedSalary } = req.body;
    const jobId = req.params.jobId;
    const candidateId = req.user.id;

    const sql = `
      INSERT INTO applications (job_id, candidate_id, cover_letter, expected_salary)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [jobId, candidateId, coverLetter || null, expectedSalary || null], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        id: result.insertId,
        job_id: jobId,
        candidate_id: candidateId,
        cover_letter: coverLetter,
        expected_salary: expectedSalary,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Application failed" });
  }
});

// ================= GET ALL JOBS (Public) =================
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM jobs ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      res.json(results);
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

// ================= CREATE JOB (Admin only) =================
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    const { title, description, company, location, type } = req.body;

    const sql = `
      INSERT INTO jobs (title, description, company, location, type)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [title, description, company, location, type], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        id: result.insertId,
        title,
        description,
        company,
        location,
        type,
      });
    });

  } catch (error) {
    res.status(500).json({ message: "Job creation failed" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM jobs WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete job" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  });
});

export default router;