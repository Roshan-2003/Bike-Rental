import Booking from "../models/Booking.js";
import Bike from "../models/Bike.js";
import Coupon from "../models/Coupon.js";
import calculateDays from "../utils/calculateDays.js";

const parseBookingDate = (value) => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00.000Z`);
  }

  return new Date(value);
};

const getUtcDateKey = (date) => date.toISOString().slice(0, 10);

export const createBooking = async (req, res) => {
  try {
    const {
      bikeId,
      startDate,
      endDate,
      paymentMethod = "COD",
      couponCode,
    } = req.body;

    if (!bikeId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message:
          "Bike, start date and end date are required",
      });
    }

    const bike = await Bike.findById(bikeId);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: "Bike not found",
      });
    }

    const start = parseBookingDate(startDate);
    const end = parseBookingDate(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    const todayKey = getUtcDateKey(new Date());
    const startDateKey =
      typeof startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(startDate)
        ? startDate
        : getUtcDateKey(start);

    if (startDateKey < todayKey) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    if (!bike.available) {
      return res.status(400).json({
        success: false,
        message: "Bike is currently unavailable",
      });
    }

    const pendingBookingCutoff = new Date(
      Date.now() - 15 * 60 * 1000,
    );

    const existingBooking = await Booking.findOne({
      bike: bikeId,
      $or: [
        { status: { $in: ["confirmed", "active"] } },
        { status: "pending", createdAt: { $gte: pendingBookingCutoff } },
      ],
      startDate: { $lt: end },
      endDate: { $gt: start },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message:
          "Bike is already booked for selected dates",
      });
    }

    const totalDays = calculateDays(start, end);

    if (totalDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid rental duration",
      });
    }

    const subtotal =
      totalDays * bike.pricePerDay;

    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
      });

      if (!coupon) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code",
        });
      }

      if (!coupon.active) {
        return res.status(400).json({
          success: false,
          message: "Coupon is inactive",
        });
      }

      if (new Date() > coupon.expiryDate) {
        return res.status(400).json({
          success: false,
          message: "Coupon has expired",
        });
      }

      if (
        coupon.usageLimit !== null &&
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Coupon usage limit reached",
        });
      }

      if (
        subtotal < coupon.minBookingAmount
      ) {
        return res.status(400).json({
          success: false,
          message: `Minimum booking amount is ₹${coupon.minBookingAmount}`,
        });
      }

      if (
        coupon.discountType ===
        "percentage"
      ) {
        discount =
          (subtotal *
            coupon.discountValue) /
          100;

        if (
          coupon.maxDiscount !== null &&
          discount > coupon.maxDiscount
        ) {
          discount = coupon.maxDiscount;
        }
      }

      if (
        coupon.discountType === "fixed"
      ) {
        discount = coupon.discountValue;
      }

      if (discount > subtotal) {
        discount = subtotal;
      }

      appliedCoupon = coupon;
    }

    const totalAmount =
      subtotal - discount;

    const booking = await Booking.create({
      user: req.user.id,
      bike: bikeId,
      startDate: start,
      endDate: end,
      totalDays,
      pricePerDay: bike.pricePerDay,
      subtotal,
      discount,
       couponCode: appliedCoupon
    ? appliedCoupon.code
    : "",
      totalAmount,
      paymentMethod,
    });

    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    const populatedBooking =
      await Booking.findById(booking._id)
        .populate(
          "bike",
          "name brand image pricePerDay"
        )
        .populate(
          "user",
          "name email phone"
        );

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("bike", "name brand model type pricePerDay image location")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("bike", "name brand model type pricePerDay image location")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only booking owner can cancel
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this booking",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Completed booking cannot be cancelled",
      });
    }

    if (booking.status === "active") {
      return res.status(400).json({
        success: false,
        message: "Active booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(filter)
      .populate("user", "name email phone")
      .populate("bike", "name brand model type pricePerDay image location")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
