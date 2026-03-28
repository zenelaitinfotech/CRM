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
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    db.query(sql, [jobId, candidateId, coverLetter || null, expectedSalary || null], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });

      res.status(201).json({
        id: result.rows[0].id,
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
      res.json(results.rows);
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

    const { title, description, company, location, type, salary, requirements } = req.body;

    // requirements arrives as an array from frontend → store as comma-separated string
    const requirementsStr = Array.isArray(requirements)
      ? requirements.join(",")
      : requirements || null;

    const sql = `
      INSERT INTO jobs (title, description, company, location, type, salary, requirements)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, title, description, company, location, type, salary, requirements, created_at
    `;

    const result = await db.query(sql, [
      title,
      description,
      company,
      location,
      type,
      salary || null,
      requirementsStr,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Job creation error:", error.message);
    res.status(500).json({ message: error.message }); // return actual pg error
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM jobs WHERE id = $1", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete job" });
    if (result.rowCount === 0) return res.status(404).json({ error: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  });
});

export default router;