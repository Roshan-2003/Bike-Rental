import crypto from "crypto";
import { getRazorpayConfig } from "../services/payment.service.js";
import Booking from "../models/Booking.js";

// CREATE RAZORPAY ORDER
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only booking owner can pay
    if (
      booking.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to pay for this booking",
      });
    }

    if (booking.paymentMethod !== "ONLINE") {
      return res.status(400).json({
        success: false,
        message: "This booking is not an online payment booking",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid",
      });
    }

    const options = {
      amount: Math.round(
        booking.totalAmount * 100
      ),
      currency: "INR",
      receipt: `booking_${booking._id}`,
    };

    const { razorpay, keyId } = getRazorpayConfig();
    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      message: "Payment order created",
      order: {
        ...order,
        key_id: keyId,
      },
      bookingId: booking._id,
      amount: booking.totalAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are required",
      });
    }

    const booking =
      await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.user.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to verify this payment",
      });
    }

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const { keySecret } = getRazorpayConfig();
    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          keySecret
        )
        .update(body)
        .digest("hex");

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      booking.paymentStatus = "failed";
      await booking.save();

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};