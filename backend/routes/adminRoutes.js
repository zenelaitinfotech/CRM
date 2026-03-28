// routes/adminRoutes.js
import express from "express";

import {
  getDashboardStats,
  getUsers,
  deleteUser,
  toggleUserStatus,
  getJobs,
  deleteJob,
  getApplications,
  deleteApplication,
  getAboutContent,
  updateAboutContent
} from "../controllers/adminController.js";

import {
  getContactInfoController,
  updateContactInfoController,
} from "../controllers/contactController.js";
 

const router = express.Router();

// Dashboard
router.get("/dashboard", getDashboardStats);

// Users
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle", toggleUserStatus);

// Jobs
router.get("/jobs", getJobs);
router.delete("/jobs/:id", deleteJob);

// Applications
router.get("/applications", getApplications);
router.delete("/applications/:id", deleteApplication);

// About Page
router.get("/about", getAboutContent);
router.post("/about", updateAboutContent);

// Contact Info
router.get("/contact-info", getContactInfoController);
router.put("/contact-info", updateContactInfoController);

export default router;
