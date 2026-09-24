import User from "../models/User.js";
import Bike from "../models/Bike.js";
import Booking from "../models/Booking.js";

import Coupon from "../models/Coupon.js";
// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalBikes,
      totalBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),
      Bike.countDocuments(),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]),
      Booking.find()
        .populate("user", "name email")
        .populate("bike", "name brand image")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    return res.status(200).json({
      success: true,
      stats: {
        users: totalUsers,
        bikes: totalBikes,
        bookings: totalBookings,
        revenue,
      },
      recentBookings,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};

// Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    // Filter by booking status
    if (status && status !== "all") {
      filter.status = status;
    }

    let bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("bike", "name brand image location pricePerDay")
      .sort({ createdAt: -1 });

    // Search user/bike
    if (search) {
      const searchText = search.toLowerCase();

      bookings = bookings.filter((booking) => {
        const userName = booking.user?.name?.toLowerCase() || "";

        const userEmail = booking.user?.email?.toLowerCase() || "";

        const bikeName = booking.bike?.name?.toLowerCase() || "";

        const bikeBrand = booking.bike?.brand?.toLowerCase() || "";

        return (
          userName.includes(searchText) ||
          userEmail.includes(searchText) ||
          bikeName.includes(searchText) ||
          bikeBrand.includes(searchText)
        );
      });
    }

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load bookings",
    });
  }
};

// Get Single Booking
export const getAdminBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("bike", "name brand model image location pricePerDay");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get admin booking error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load booking",
    });
  }
};

// Update Booking Status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "active",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = status;

    // If cancelled and payment was done
    if (status === "cancelled" && booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("bike", "name brand image location pricePerDay");

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
};

// Get All Coupons
export const getAllCoupons = async (req, res) => {
  try {
    const { search, active } = req.query;

    const filter = {};

    if (active !== undefined && active !== "all") {
      filter.active = active === "true";
    }

    let coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    if (search) {
      const searchText = search.toLowerCase();

      coupons = coupons.filter((coupon) =>
        coupon.code?.toLowerCase().includes(searchText),
      );
    }

    return res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("Get coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load coupons",
    });
  }
};

// Create Coupon
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
      active,
    } = req.body;

    if (!code || !discountType || discountValue === undefined || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Required coupon fields are missing",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type",
      });
    }

    if (discountValue <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0",
      });
    }

    if (discountType === "percentage" && discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100",
      });
    }

    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      discountType,
      discountValue,
      minBookingAmount: minBookingAmount || 0,
      maxDiscount: maxDiscount || 0,
      expiryDate,
      usageLimit: usageLimit || 0,
      usedCount: 0,
      active: active === undefined ? true : active,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
    });
  }
};

// Update Coupon
export const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
      active,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    if (discountType) {
      if (!["percentage", "fixed"].includes(discountType)) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount type",
        });
      }

      coupon.discountType = discountType;
    }

    if (code) {
      const newCode = code.toUpperCase().trim();

      const duplicate = await Coupon.findOne({
        code: newCode,
        _id: { $ne: coupon._id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }

      coupon.code = newCode;
    }

    if (discountValue !== undefined) {
      if (discountValue <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount value",
        });
      }

      coupon.discountValue = discountValue;
    }

    if (coupon.discountType === "percentage") {
      if (coupon.discountValue > 100) {
        return res.status(400).json({
          success: false,
          message: "Percentage discount cannot exceed 100",
        });
      }
    }

    if (minBookingAmount !== undefined) {
      coupon.minBookingAmount = minBookingAmount;
    }

    if (maxDiscount !== undefined) {
      coupon.maxDiscount = maxDiscount;
    }

    if (expiryDate) {
      if (new Date(expiryDate) <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be in the future",
        });
      }

      coupon.expiryDate = expiryDate;
    }

    if (usageLimit !== undefined) {
      coupon.usageLimit = usageLimit;
    }

    if (active !== undefined) {
      coupon.active = active;
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Update coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coupon",
    });
  }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Delete coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
    });
  }
};

// Toggle Coupon Status
export const toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    coupon.active = !coupon.active;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: coupon.active ? "Coupon activated" : "Coupon deactivated",
      coupon,
    });
  } catch (error) {
    console.error("Toggle coupon status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update coupon status",
    });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    const filter = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    let users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    if (search) {
      const searchText = search.toLowerCase();

      users = users.filter((user) => {
        const name = user.name?.toLowerCase() || "";
        const email = user.email?.toLowerCase() || "";
        const phone = user.phone?.toLowerCase() || "";

        return (
          name.includes(searchText) ||
          email.includes(searchText) ||
          phone.includes(searchText)
        );
      });
    }

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

// Get Single User
export const getAdminUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const bookings = await Booking.find({
      user: user._id,
    })
      .populate("bike", "name brand image location")
      .sort({ createdAt: -1 });

    const totalSpent = bookings
      .filter((booking) => booking.paymentStatus === "paid")
      .reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      user,
      bookings,
      stats: {
        totalBookings: bookings.length,
        totalSpent,
      },
    });
  } catch (error) {
    console.error("Get admin user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load user",
    });
  }
};



export const getAdminReports = async (req, res) => {
  try {
    const [
      revenueResult,
      bookingStats,
      monthlyRevenue,
      popularBikes,
      paymentStats,
    ] = await Promise.all([
      // Total paid revenue
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
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
      ]),

      // Booking status statistics
      Booking.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Monthly revenue
      Booking.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            revenue: {
              $sum: "$totalAmount",
            },
            bookings: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),

      // Most rented bikes
      Booking.aggregate([
        {
          $match: {
            status: {
              $ne: "cancelled",
            },
          },
        },
        {
          $group: {
            _id: "$bike",
            totalBookings: {
              $sum: 1,
            },
            revenue: {
              $sum: "$totalAmount",
            },
          },
        },
        {
          $sort: {
            totalBookings: -1,
          },
        },
        {
          $limit: 5,
        },
        {
          $lookup: {
            from: "bikes",
            localField: "_id",
            foreignField: "_id",
            as: "bike",
          },
        },
        {
          $unwind: {
            path: "$bike",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            totalBookings: 1,
            revenue: 1,
            name: "$bike.name",
            brand: "$bike.brand",
            image: "$bike.image",
          },
        },
      ]),

      // Payment statistics
      Booking.aggregate([
        {
          $group: {
            _id: "$paymentStatus",
            count: {
              $sum: 1,
            },
            amount: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    const totalBookings = await Booking.countDocuments();

    const paidBookings =
      await Booking.countDocuments({
        paymentStatus: "paid",
      });

    const pendingPayments =
      await Booking.countDocuments({
        paymentStatus: "pending",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        status: "cancelled",
      });

    return res.status(200).json({
      success: true,

      summary: {
        totalRevenue,
        totalBookings,
        paidBookings,
        pendingPayments,
        cancelledBookings,
      },

      bookingStats,

      monthlyRevenue,

      popularBikes,

      paymentStats,
    });
  } catch (error) {
    console.error(
      "Admin reports error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load admin reports",
    });
  }
};