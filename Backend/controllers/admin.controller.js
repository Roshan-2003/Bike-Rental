import User from "../models/User.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalBikes = await Bike.countDocuments();

    const totalBookings = await Booking.countDocuments();

    const pendingBookings = await Booking.countDocuments({
      status: "pending",
    });

    const confirmedBookings = await Booking.countDocuments({
      status: "confirmed",
    });

    const activeBookings = await Booking.countDocuments({
      status: "active",
    });

    const completedBookings = await Booking.countDocuments({
      status: "completed",
    });

    const cancelledBookings = await Booking.countDocuments({
      status: "cancelled",
    });

    // Calculate revenue from completed bookings
    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,

      dashboard: {
        totalUsers,
        totalBikes,
        totalBookings,
        pendingBookings,
        confirmedBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Search by name/email
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Only these roles are allowed
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be either user or admin",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
