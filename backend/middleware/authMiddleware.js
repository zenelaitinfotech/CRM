import jwt from "jsonwebtoken";
import db from "../config/db.js"; // your MySQL connection

export const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Fetch user from MySQL
    db.query("SELECT id, name, email, role FROM users WHERE id = ?", [userId], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });
      if (results.length === 0) return res.status(401).json({ message: "User not found" });

      req.user = results[0]; // attach user to req
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Admin only middleware stays same
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};