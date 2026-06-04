import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import db from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobs.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";


const app = express();

const allowedOrigins = [
  "https://crmjobshopee.com",
  "https://www.crmjobshopee.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    const isLocal = origin.startsWith("http://localhost:") || 
                    origin.startsWith("http://127.0.0.1:") || 
                    origin === "http://localhost" || 
                    origin === "http://127.0.0.1";
                    
    if (allowedOrigins.indexOf(origin) !== -1 || isLocal) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true
}));


app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});

app.post("/check", (req, res) => {
  res.json({ message: "POST working" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
