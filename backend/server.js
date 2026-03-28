import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobs.js";
import adminRoutes from "./routes/adminRoutes.js";


dotenv.config();



const app = express();
app.use(cors({
  origin: "http://localhost:8080", // allow your frontend dev server
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});

app.post("/check", (req, res) => {
  res.json({ message: "POST working" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
