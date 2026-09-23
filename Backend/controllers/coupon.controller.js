import Coupon from "../models/Coupon.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minBookingAmount = 0,
      maxDiscount = null,
      expiryDate,
      usageLimit = null,
    } = req.body;

    if (
      !code ||
      !discountType ||
      !discountValue ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Code, discount type, discount value and expiry date are required",
      });
    }

    if (!["percentage", "fixed"].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message:
          "Discount type must be percentage or fixed",
      });
    }

    if (
      discountType === "percentage" &&
      discountValue > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Percentage discount cannot exceed 100",
      });
    }

    const existingCoupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minBookingAmount,
      maxDiscount,
      expiryDate,
      usageLimit,
    });

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(
      req.params.id
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const applyCoupon = async (req, res) => {
  try {
    const {
      code,
      bookingAmount,
    } = req.body;

    if (!code || bookingAmount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon code and booking amount are required",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
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
        message: "Coupon usage limit reached",
      });
    }

    if (
      Number(bookingAmount) <
      coupon.minBookingAmount
    ) {
      return res.status(400).json({
        success: false,
        message: `Minimum booking amount is ₹${coupon.minBookingAmount}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount =
        (Number(bookingAmount) *
          coupon.discountValue) /
        100;

      if (
        coupon.maxDiscount !== null &&
        discount > coupon.maxDiscount
      ) {
        discount = coupon.maxDiscount;
      }
    }

    if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    if (discount > Number(bookingAmount)) {
      discount = Number(bookingAmount);
    }

    const finalAmount =
      Number(bookingAmount) - discount;

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: coupon.code,
      discount,
      finalAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};