import express from "express";
import {
  getDashboardStats,
  getAllBookings,
  getAdminBookingById,
  updateBookingStatus,
  getAllUsers,
  getAdminUserById,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getAdminReports,
} from "../controllers/admin.controller.js";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

// Users
router.get("/users", protect, adminOnly, getAllUsers);

router.get("/users/:id", protect, adminOnly, getAdminUserById);

// Coupons
router.get("/coupons", protect, adminOnly, getAllCoupons);

router.post("/coupons", protect, adminOnly, createCoupon);

router.put("/coupons/:id", protect, adminOnly, updateCoupon);

router.delete("/coupons/:id", protect, adminOnly, deleteCoupon);

router.put("/coupons/:id/toggle", protect, adminOnly, toggleCouponStatus);

// Bookings
router.get("/bookings", protect, adminOnly, getAllBookings);

router.get("/bookings/:id", protect, adminOnly, getAdminBookingById);

router.put("/bookings/:id/status", protect, adminOnly, updateBookingStatus);

router.get("/reports", protect, adminOnly, getAdminReports);

export default router;
