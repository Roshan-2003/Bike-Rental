import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import api from "../services/api";

const Payment = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(
    state?.booking || null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking && id) {
      api.get(`/bookings/${id}`)
        .then((res) => setBooking(res.data.booking))
        .catch((err) => console.error("Failed to load booking:", err));
    }

    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          resolve(true);
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, [id, booking]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Create Razorpay order
      const orderResponse = await api.post(
        "/payments/create-order",
        {
          bookingId: id,
        }
      );

      const order = orderResponse.data.order;

      if (!order) {
        throw new Error(
          "Unable to create payment order."
        );
      }

      // 2. Razorpay options
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "RideX",
        description: `Bike Rental Booking #${id}`,
        order_id: order.id,

        handler: async function (response) {
          try {
            // 3. Verify payment
            const verifyResponse = await api.post(
              "/payments/verify",
              {
                bookingId: id,
                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,
              }
            );

            if (verifyResponse.data.success) {
              navigate(`/bookings/${id}`, {
                state: {
                  paymentSuccess: true,
                },
              });
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setError(
              error.response?.data?.message ||
                "Payment verification failed."
            );
          }
        },

        prefill: {
          name: booking?.user?.name || "",
          email: booking?.user?.email || "",
          contact: booking?.user?.phone || "",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // 4. Open Razorpay
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK failed to load."
        );
      }

      const razorpay = new window.Razorpay(
        options
      );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Payment failed:",
            response.error
          );

          setError(
            response.error?.description ||
              "Payment failed. Please try again."
          );

          setLoading(false);
        }
      );

      razorpay.open();

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );

      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">

          <h2 className="text-2xl font-bold text-slate-900">
            Booking Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please create a booking first.
          </p>

          <button
            onClick={() => navigate("/bikes")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Browse Bikes
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Complete Payment
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Securely complete your bike rental payment.
          </p>

        </div>
      </div>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid gap-6 md:grid-cols-2">

          {/* Payment Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard size={24} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Online Payment
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You will be redirected to Razorpay's secure
              checkout to complete your payment.
            </p>

            <div className="mt-6 space-y-4">

              <div className="flex items-center gap-3">
                <CheckCircle
                  size={18}
                  className="text-emerald-500"
                />

                <span className="text-sm text-slate-600">
                  Secure payment gateway
                </span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle
                  size={18}
                  className="text-emerald-500"
                />

                <span className="text-sm text-slate-600">
                  Multiple payment options
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={18}
                  className="text-emerald-500"
                />

                <span className="text-sm text-slate-600">
                  Your payment information is protected
                </span>
              </div>

            </div>

          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Payment Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Booking ID
                </span>

                <span className="font-semibold text-slate-900">
                  {booking._id}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Bike
                </span>

                <span className="font-semibold text-slate-900">
                  {booking.bike?.name ||
                    "Bike Rental"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Rental Days
                </span>

                <span className="font-semibold text-slate-900">
                  {booking.totalDays}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">

                  <span className="font-bold text-slate-900">
                    Total Amount
                  </span>

                  <span className="text-2xl font-black text-blue-600">
                    ₹{booking.totalAmount}
                  </span>

                </div>
              </div>

            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  Pay ₹{booking.totalAmount}
                </>
              )}
            </button>

            <p className="mt-3 text-center text-xs text-slate-400">
              Powered by Razorpay
            </p>

          </div>

        </div>

      </section>
    </div>
  );
};

export default Payment;