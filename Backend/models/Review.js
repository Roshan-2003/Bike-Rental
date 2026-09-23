import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// One user can review one bike only once
reviewSchema.index(
  {
    user: 1,
    bike: 1,
  },
  {
    unique: true,
  }
);

const Review = mongoose.model(
  "Review",
  reviewSchema
);

export default Review;