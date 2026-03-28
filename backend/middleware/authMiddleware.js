import jwt from "jsonwebtoken";
import db from "../config/db.js";

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

    db.query("SELECT id, name, email, role FROM users WHERE id = $1", [userId], (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.rows.length === 0) return res.status(401).json({ message: "User not found" });

      req.user = result.rows[0];
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};