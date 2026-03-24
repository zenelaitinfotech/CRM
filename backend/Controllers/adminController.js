import db from "../config/db.js";

// 1️⃣ Dashboard stats
export const getDashboardStats = (req, res) => {
  const sqlUsers = "SELECT COUNT(*) AS totalUsers FROM users";
  const sqlJobs = "SELECT COUNT(*) AS totalJobs FROM jobs";
  const sqlApplications = "SELECT COUNT(*) AS totalApplications FROM applications";

  db.query(sqlUsers, (err, userResult) => {
    if (err) return res.status(500).json({ message: "Server Error" });

    db.query(sqlJobs, (err, jobResult) => {
      if (err) return res.status(500).json({ message: "Server Error" });

      db.query(sqlApplications, (err, appResult) => {
        if (err) return res.status(500).json({ message: "Server Error" });

        res.json({
          totalUsers: userResult[0].totalUsers,
          totalJobs: jobResult[0].totalJobs,
          totalApplications: appResult[0].totalApplications,
        });
      });
    });
  });
};

// 2️⃣ Get all users
export const getUsers = (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    res.json(results);
  });
};

// 3️⃣ Delete a user
export const deleteUser = (req, res) => {
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    res.json({ message: "User deleted successfully" });
  });
};

// 4️⃣ Toggle block/unblock user
export const toggleUserStatus = (req, res) => {
  const sqlGet = "SELECT isBlocked FROM users WHERE id = ?";
  db.query(sqlGet, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    if (!result.length) return res.status(404).json({ message: "User not found" });

    const newStatus = result[0].isBlocked ? 0 : 1;
    const sqlUpdate = "UPDATE users SET isBlocked = ? WHERE id = ?";
    db.query(sqlUpdate, [newStatus, req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Server Error" });
      res.json({ message: `User ${newStatus ? "blocked" : "unblocked"}` });
    });
  });
};

// 5️⃣ Get all jobs
export const getJobs = (req, res) => {
  const sql = "SELECT * FROM jobs";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    res.json(results);
  });
};

// 6️⃣ Delete a job
export const deleteJob = (req, res) => {
  const sql = "DELETE FROM jobs WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    res.json({ message: "Job deleted successfully" });
  });
};

// 7️⃣ Get all applications
export const getApplications = (req, res) => {
  const sql = `
    SELECT a.*, j.title AS job_title, u.name AS candidate_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.candidate_id = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    res.json(results);
  });
};

// 8️⃣ Delete an application
export const deleteApplication = (req, res) => {
  const sql = "DELETE FROM applications WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: "Server Error" });
    res.json({ message: "Application deleted successfully" });
  });
};

export const getAboutContent = (req, res) => {
  db.query("SELECT * FROM about WHERE id = 1", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    const data = result[0];

    res.json({
      heading: data.heading,
      description: data.description,
      values: JSON.parse(data.values_json || "[]")
    });
  });
};

export const updateAboutContent = (req, res) => {
  const { heading, description, values } = req.body;

  db.query(
    "UPDATE about SET heading = ?, description = ?, values_json = ? WHERE id = 1",
    [heading, description, JSON.stringify(values)],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      res.json({ message: "About updated successfully" });
    }
  );
};