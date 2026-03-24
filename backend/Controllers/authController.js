import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================== LOGIN ======================
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!results.length) return res.status(400).json({ message: "Invalid email or password" });

    const user = results[0];

    // Compare password
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid email or password" });

    // Create token
    const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1d" });

    // Send response
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // important for frontend Admin button
      },
    });
  });
};