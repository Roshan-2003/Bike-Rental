import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Get all users
router.get("/users", protect, adminOnly, getAllUsers);

// Change user role
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

// Delete user
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
