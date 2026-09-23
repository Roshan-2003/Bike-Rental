import Review from "../models/Review.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

export const createReview = async (req, res) => {
  try {
    const { bikeId, rating, comment } = req.body;

    if (!bikeId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Bike, rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      bike: bikeId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this bike",
      });
    }

    const completedBooking = await Booking.findOne({
      user: req.user.id,
      bike: bikeId,
      status: "completed",
    });

    if (!completedBooking) {
      return res.status(403).json({
        success: false,
        message: "You can review a bike only after completing a rental",
      });
    }

    const review = await Review.create({
      user: req.user.id,
      bike: bikeId,
      rating,
      comment,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name profileImage")
      .populate("bike", "name brand image");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    // Duplicate review
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this bike",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBikeReviews = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    const reviews = await Review.find({
      bike: bikeId,
    })
      .populate("user", "name profileImage")
      .sort({
        createdAt: -1,
      });

    // Calculate average rating
    const ratingResult = await Review.aggregate([
      {
        $match: {
          bike: bike._id,
        },
      },
      {
        $group: {
          _id: "$bike",
          averageRating: {
            $avg: "$rating",
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    const averageRating =
      ratingResult.length > 0
        ? Number(ratingResult[0].averageRating.toFixed(1))
        : 0;

    const reviewCount =
      ratingResult.length > 0 ? ratingResult[0].reviewCount : 0;

    res.status(200).json({
      success: true,
      averageRating,
      reviewCount,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (rating === undefined && comment === undefined) {
      return res.status(400).json({
        success: false,
        message: "Rating or comment is required",
      });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only owner can update
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own review",
      });
    }

    if (rating !== undefined) {
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate("user", "name profileImage")
      .populate("bike", "name brand image");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Owner or admin can delete
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
