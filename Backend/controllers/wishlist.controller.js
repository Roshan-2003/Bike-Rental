import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const existing = await Wishlist.findOne({
      user: req.user._id,
      bike: bikeId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bike already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user._id,
      bike: bikeId,
    });

    return res.status(201).json({
      success: true,
      message: "Bike added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add bike to wishlist",
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const wishlist = await Wishlist.findOneAndDelete({
      user: req.user._id,
      bike: bikeId,
    });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Bike not found in wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Bike removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove bike",
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    })
      .populate(
        "bike",
        "name brand image location pricePerDay fuelType available"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get wishlist",
    });
  }
};