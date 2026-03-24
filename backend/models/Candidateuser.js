// candidate.js (MySQL version)
import db from "../config/db.js";

// Create a new candidate
export const createCandidate = (data, callback) => {
  const {
    name,
    email,
    password,
    phone,
    location,
    dob,
    jobTitle,
    experience,
    skills,     // array of skills
    resumeUrl,
    role,
  } = data;

  const skillsStr = skills ? skills.join(",") : null; // store as CSV

  const sql = `
    INSERT INTO users
      (name, email, password, phone, location, dob, job_title, experience, skills, resume_url, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, password, phone, location, dob, jobTitle, experience, skillsStr, resumeUrl, role || "candidate"],
    callback
  );
};

// Get all candidates
export const getCandidates = (callback) => {
  const sql = `SELECT * FROM users WHERE role='candidate'`;
  db.query(sql, callback);
};

// Get candidate by ID
export const getCandidateById = (id, callback) => {
  const sql = `SELECT * FROM users WHERE id = ? AND role='candidate'`;
  db.query(sql, [id], callback);
};

// Update candidate
export const updateCandidate = (id, data, callback) => {
  const {
    name,
    email,
    password,
    phone,
    location,
    dob,
    jobTitle,
    experience,
    skills,
    resumeUrl,
    role,
  } = data;

  const skillsStr = skills ? skills.join(",") : null;

  const sql = `
    UPDATE users
    SET name=?, email=?, password=?, phone=?, location=?, dob=?, job_title=?, experience=?, skills=?, resume_url=?, role=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=? AND role='candidate'
  `;

  db.query(
    sql,
    [name, email, password, phone, location, dob, jobTitle, experience, skillsStr, resumeUrl, role, id],
    callback
  );
};

// Delete candidate
export const deleteCandidate = (id, callback) => {
  const sql = `DELETE FROM users WHERE id=? AND role='candidate'`;
  db.query(sql, [id], callback);
};