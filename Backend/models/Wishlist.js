import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// Same user same bike ko dobara wishlist mein nahi add kar sakta
wishlistSchema.index(
  {
    user: 1,
    bike: 1,
  },
  {
    unique: true,
  }
);

const Wishlist = mongoose.model(
  "Wishlist",
  wishlistSchema
);

export default Wishlist;