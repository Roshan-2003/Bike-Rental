import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  addToWishlist,
  removeFromWishlist,
  getMyWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/:bikeId", protect, addToWishlist);

router.delete("/:bikeId", protect, removeFromWishlist);

router.get("/", protect, getMyWishlist);

export default router;