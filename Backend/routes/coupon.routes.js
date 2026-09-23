import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

import {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  applyCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, createCoupon);

router.get("/", protect, adminOnly, getAllCoupons);

router.delete("/:id", protect, adminOnly, deleteCoupon);

router.post("/apply", protect, applyCoupon);

export default router;
