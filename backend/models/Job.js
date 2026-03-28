import db from "../config/db.js";

// Create a new job
export const createJob = (data, callback) => {
  const { title, description, company, location, type, salary, requirements} = data;
  const sql = `
  INSERT INTO jobs (title, description, company, location, type, salary, requirements )
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id, title, description, company, location, type, salary, requirements
`;
  db.query(sql, [title, description, company, location, type, salary, requirements], callback);
};

// Get all jobs
export const getJobs = (callback) => {
  const sql = `SELECT * FROM jobs`;
  db.query(sql, callback);
};

// Get job by ID
export const getJobById = (id, callback) => {
  const sql = `SELECT * FROM jobs WHERE id = $1`;
  db.query(sql, [id], callback);
};

// Update a job
export const updateJob = (id, data, callback) => {
  const { title, description, company, location, type } = data;
  const sql = `
    UPDATE jobs
    SET title = $1, description = $2, company = $3, location = $4, type = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
  `;
  db.query(sql, [title, description, company, location, type, id], callback);
};

// Delete a job
export const deleteJob = (id, callback) => {
  const sql = `DELETE FROM jobs WHERE id = $1`;
  db.query(sql, [id], callback);
};