import db from "../config/db.js";

// Create a new user
export const createUser = (data, callback) => {
  const {
    name,
    email,
    password,
    phone,
    location,
    dob,
    jobTitle,
    experience,
    skills,       // array of skills
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

// Get all users
export const getUsers = (callback) => {
  const sql = `SELECT * FROM users`;
  db.query(sql, callback);
};

// Get user by ID
export const getUserById = (id, callback) => {
  const sql = `SELECT * FROM users WHERE id = ?`;
  db.query(sql, [id], callback);
};

// Get user by Email (for login)
export const getUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  db.query(sql, [email], callback);
};

// Update a user
export const updateUser = (id, data, callback) => {
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
    WHERE id=?
  `;

  db.query(
    sql,
    [name, email, password, phone, location, dob, jobTitle, experience, skillsStr, resumeUrl, role, id],
    callback
  );
};

// Delete a user
export const deleteUser = (id, callback) => {
  const sql = `DELETE FROM users WHERE id = ?`;
  db.query(sql, [id], callback);
};