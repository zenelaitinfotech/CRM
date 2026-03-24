import db from "../config/db.js";

// Create a new job
export const createJob = (data, callback) => {
  const { title, description, company, location, type } = data;
  const sql = `
    INSERT INTO jobs (title, description, company, location, type)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [title, description, company, location, type], callback);
};

// Get all jobs
export const getJobs = (callback) => {
  const sql = `SELECT * FROM jobs`;
  db.query(sql, callback);
};

// Get job by ID
export const getJobById = (id, callback) => {
  const sql = `SELECT * FROM jobs WHERE id = ?`;
  db.query(sql, [id], callback);
};

// Update a job
export const updateJob = (id, data, callback) => {
  const { title, description, company, location, type } = data;
  const sql = `
    UPDATE jobs
    SET title = ?, description = ?, company = ?, location = ?, type = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.query(sql, [title, description, company, location, type, id], callback);
};

// Delete a job
export const deleteJob = (id, callback) => {
  const sql = `DELETE FROM jobs WHERE id = ?`;
  db.query(sql, [id], callback);
};