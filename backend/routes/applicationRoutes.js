import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import db from "../config/db.js";
import { generateApplicationPDF } from "../utils/pdfGenerator.js";
import { sendApplicationEmail } from "../utils/emailSender.js";

const router = express.Router();

// Ensure upload folders exist
const resumeDir = "./uploads/resumes";
const pdfDir = "./uploads/applications";
if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

// Configure Multer storage for Resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Apply for a job
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    let { jobId, candidateId, name, email, phone, location, expectedSalary, coverLetter, jobTitle } = req.body;

    let resumeUrl = req.body.resumeUrl || null;
    
    // If a file was uploaded, save its local static URL
    if (req.file) {
      resumeUrl = `http://localhost:5000/uploads/resumes/${req.file.filename}`;
    }

    // Resolve candidate ID if undefined
    if (!candidateId || candidateId === "undefined") {
      if (email) {
        const userRes = await db.query("SELECT id FROM users WHERE email = $1", [email]);
        if (userRes.rows.length > 0) {
          candidateId = userRes.rows[0].id;
        } else {
          // Auto-register candidate on the fly if not registered
          const tempPassword = Math.random().toString(36).slice(-8);
          const bcrypt = await import("bcryptjs");
          const hashedPassword = await bcrypt.default.hash(tempPassword, 10);
          
          const insertUserSql = `
            INSERT INTO users (name, email, password, phone, location, resume_url, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
          `;
          const newUserRes = await db.query(insertUserSql, [
            name || "Guest Applicant",
            email,
            hashedPassword,
            phone || null,
            location || null,
            resumeUrl,
            "candidate"
          ]);
          candidateId = newUserRes.rows[0].id;
          console.log(`Auto-registered new user on application: ${email} (ID: ${candidateId})`);
        }
      }
    }

    // Resolve job ID if undefined
    if (!jobId || jobId === "undefined") {
      if (jobTitle) {
        const jobRes = await db.query("SELECT id FROM jobs WHERE title = $1", [jobTitle]);
        if (jobRes.rows.length > 0) {
          jobId = jobRes.rows[0].id;
        }
      }
    }

    if (!jobId || jobId === "undefined" || !candidateId || candidateId === "undefined") {
      return res.status(400).json({ message: "Job ID and Candidate ID are required and could not be resolved." });
    }

    // 1. Update the candidate's profile details in the database
    const updateProfileSql = `
      UPDATE users 
      SET phone = COALESCE($1, phone), 
          location = COALESCE($2, location),
          resume_url = COALESCE($3, resume_url)
      WHERE id = $4
    `;
    await db.query(updateProfileSql, [phone, location, resumeUrl, candidateId]);

    // 2. Insert the application record
    const insertApplicationSql = `
      INSERT INTO applications (job_id, candidate_id, cover_letter, expected_salary, resume_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const appResult = await db.query(insertApplicationSql, [jobId, candidateId, coverLetter || "", expectedSalary || "", resumeUrl]);
    const applicationId = appResult.rows[0].id;

    // 3. Generate PDF summary
    const pdfFileName = `Application_${applicationId}_${Date.now()}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);
    const pdfUrl = `http://localhost:5000/uploads/applications/${pdfFileName}`;

    const candidateData = {
      name,
      email,
      phone,
      location,
      expectedSalary,
      jobTitle,
      coverLetter,
      resumeUrl
    };

    await generateApplicationPDF(candidateData, pdfPath);

    // 4. Send Email Notification with PDF attachment
    try {
      await sendApplicationEmail(candidateData, pdfPath);
    } catch (emailErr) {
      console.error("Email sending failed but application was recorded:", emailErr);
    }

    res.status(201).json({
      message: "Application submitted successfully! 🎉",
      applicationId,
      pdfUrl,
      resumeUrl
    });
  } catch (error) {
    console.error("Error in job application submit:", error);
    res.status(500).json({ message: error.message || "Failed to submit application" });
  }
});

export default router;
