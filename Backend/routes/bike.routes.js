import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";
import imageUpload from "../middleware/bike-upload.middleware.js";

import {
  createBike,
  getAllBikes,
  getBikeById,
  updateBike,
  deleteBike,
} from "../controllers/bike.controller.js";

const router = express.Router();

// Public
router.get("/", getAllBikes);

router.get("/:id", getBikeById);

// Admin
router.post("/", protect, adminOnly, imageUpload.single("imageFile"), createBike);

router.put("/:id", protect, adminOnly, imageUpload.single("imageFile"), updateBike);

router.delete("/:id", protect, adminOnly, deleteBike);

export default router;
