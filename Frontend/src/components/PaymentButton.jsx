import {
  useState,
} from "react";

import {
  createPaymentOrder,
  verifyPayment,
} from "../services/payment.service";

const PaymentButton = ({
  booking,
  onSuccess,
}) => {
  const [loading, setLoading] =
    useState(false);

  const handlePayment =
    async () => {
      try {
        setLoading(true);

        // STEP 1
        // Create Razorpay order
        const orderResponse =
          await createPaymentOrder(
            booking._id
          );

        const order =
          orderResponse.order;

        // STEP 2
        // Razorpay Checkout
        const options = {
          key: import.meta.env
            .VITE_RAZORPAY_KEY_ID,

          amount:
            order.amount,

          currency:
            order.currency,

          name: "Bike Rental",

          description:
            `Bike rental booking`,

          order_id:
            order.id,

          handler:
            async (
              response
            ) => {
              try {
                // STEP 3
                // Verify payment
                const result =
                  await verifyPayment(
                    {
                      bookingId:
                        booking._id,

                      razorpay_order_id:
                        response.razorpay_order_id,

                      razorpay_payment_id:
                        response.razorpay_payment_id,

                      razorpay_signature:
                        response.razorpay_signature,
                    }
                  );

                if (
                  result.success
                ) {
                  alert(
                    "Payment successful!"
                  );

                  onSuccess?.(
                    result.booking
                  );
                }
              } catch (error) {
                console.error(
                  error
                );

                alert(
                  error.response
                    ?.data
                    ?.message ||
                    "Payment verification failed"
                );
              }
            },

          prefill: {
            name:
              booking.user
                ?.name || "",

            email:
              booking.user
                ?.email || "",

            contact:
              booking.user
                ?.phone || "",
          },

          theme: {
            color:
              "#2563eb",
          },

          modal: {
            ondismiss:
              () => {
                console.log(
                  "Payment popup closed"
                );
              },
          },
        };

        if (
          !window.Razorpay
        ) {
          throw new Error(
            "Razorpay SDK not loaded"
          );
        }

        const razorpay =
          new window.Razorpay(
            options
          );

        razorpay.on(
          "payment.failed",
          function (
            response
          ) {
            console.error(
              "Payment failed:",
              response.error
            );

            alert(
              response.error
                ?.description ||
                "Payment failed"
            );
          }
        );

        razorpay.open();
      } catch (error) {
        console.error(
          error
        );

        alert(
          error.response
            ?.data?.message ||
            error.message ||
            "Unable to start payment"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-slate-400"
    >
      {loading
        ? "Opening Payment..."
        : `Pay ₹${booking.totalAmount}`}
    </button>
  );
};

export default PaymentButton;