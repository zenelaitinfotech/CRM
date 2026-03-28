import db from "../config/db.js";

// Create a new application
export const createApplication = (data, callback) => {
  const { job_id, candidate_id, cover_letter, expected_salary } = data;
  const sql = `
    INSERT INTO applications (job_id, candidate_id, cover_letter, expected_salary)
    VALUES ($1, $2, $3, $4)
  `;
  db.query(sql, [job_id, candidate_id, cover_letter, expected_salary], callback);
};

// Get all applications
export const getApplications = (callback) => {
  const sql = `
    SELECT a.*, j.title AS job_title, u.name AS candidate_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.candidate_id = u.id
  `;
  db.query(sql, callback);
};

// Get application by ID
export const getApplicationById = (id, callback) => {
  const sql = `
    SELECT a.*, j.title AS job_title, u.name AS candidate_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.candidate_id = u.id
    WHERE a.id =  $1
  `;
  db.query(sql, [id], callback);
};

// Update application
export const updateApplication = (id, data, callback) => {
  const { cover_letter, expected_salary } = data;
  const sql = `
    UPDATE applications
    SET cover_letter = $1, expected_salary = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
  `;
  db.query(sql, [cover_letter, expected_salary, id], callback);
};

// Delete application
export const deleteApplication = (id, callback) => {
  const sql = `DELETE FROM applications WHERE id = $1`;
  db.query(sql, [id], callback);
};