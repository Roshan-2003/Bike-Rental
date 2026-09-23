import Wishlist from "../models/Wishlist.js";
import Bike from "../models/Bike.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const { bikeId } = req.params;

    // Check bike
    const bikeExists = await Bike.findById(bikeId);

    if (!bikeExists) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    // Check already added
    const existingWishlist = await Wishlist.findOne({
      user: req.user.id,
      bike: bikeId,
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: "Bike already added to wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user: req.user.id,
      bike: bikeId,
    });

    const populatedWishlist =
      await Wishlist.findById(wishlist._id)
        .populate("bike");

    res.status(201).json({
      success: true,
      message: "Bike added to wishlist",
      wishlist: populatedWishlist,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bike already added to wishlist",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const { bikeId } = req.params;

    const wishlist =
      await Wishlist.findOneAndDelete({
        user: req.user.id,
        bike: bikeId,
      });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Bike not found in wishlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bike removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET MY WISHLIST
export const getMyWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user.id,
    })
      .populate("bike")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};