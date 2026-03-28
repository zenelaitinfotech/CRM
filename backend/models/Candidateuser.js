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
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
  const sql = `SELECT * FROM users WHERE id = $1 AND role='candidate'`;
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
    SET name=$1, email=$2, password=$3, phone=$4, location=$5, dob=$6, job_title=$7, experience=$8, skills=$9, resume_url=$10, role=$11, updated_at=CURRENT_TIMESTAMP
    WHERE id=$12 AND role='candidate'
  `;

  db.query(
    sql,
    [name, email, password, phone, location, dob, jobTitle, experience, skillsStr, resumeUrl, role, id],
    callback
  );
};

// Delete candidate
export const deleteCandidate = (id, callback) => {
  const sql = `DELETE FROM users WHERE id=$1 AND role='candidate'`;
  db.query(sql, [id], callback);
};