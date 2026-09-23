import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createReview,
  getBikeReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/bike/:bikeId", getBikeReviews);

// Create review
router.post("/", protect, createReview);

// Update own review
router.put("/:id", protect, updateReview);

// Delete review
router.delete("/:id", protect, deleteReview);

export default router;
