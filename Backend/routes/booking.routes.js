import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

const router = express.Router();



router.post(
  "/",
  protect,
  createBooking
);

router.get(
  "/my",
  protect,
  getMyBookings
);

router.get(
  "/:id",
  protect,
  getBookingById
);

router.put(
  "/:id/cancel",
  protect,
  cancelBooking
);


router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllBookings
);

router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateBookingStatus
);

export default router;