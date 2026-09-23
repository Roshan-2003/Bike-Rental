import {
  useEffect,
  useState,
} from "react";

import {
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getBookingById,
  cancelBooking,
} from "../services/booking.service";

import PaymentButton from "../components/PaymentButton";

const BookingDetails = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadBooking =
    async () => {
      try {
        const data =
          await getBookingById(id);

        setBooking(
          data.booking
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleCancel =
    async () => {
      const confirmCancel =
        window.confirm(
          "Are you sure you want to cancel this booking?"
        );

      if (!confirmCancel) {
        return;
      }

      try {
        await cancelBooking(id);

        alert(
          "Booking cancelled"
        );

        loadBooking();
      } catch (error) {
        alert(
          error.response?.data
            ?.message ||
            "Unable to cancel booking"
        );
      }
    };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-20 text-center">
        Booking not found.
      </div>
    );
  }

  const handlePaymentSuccess =
    (updatedBooking) => {
      setBooking(
        updatedBooking
      );
    };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Booking Details
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Booking ID:{" "}
          {booking._id}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <img
            src={
              booking.bike?.image
            }
            alt={
              booking.bike?.name
            }
            className="h-64 w-full rounded-lg object-cover"
          />

          <h2 className="mt-5 text-xl font-bold">
            {booking.bike?.name}
          </h2>

          <p className="text-slate-500">
            {booking.bike?.brand}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <Row
              label="Start Date"
              value={new Date(
                booking.startDate
              ).toLocaleDateString()}
            />

            <Row
              label="End Date"
              value={new Date(
                booking.endDate
              ).toLocaleDateString()}
            />

            <Row
              label="Rental Days"
              value={
                booking.totalDays
              }
            />

            <Row
              label="Price / Day"
              value={`₹${booking.pricePerDay}`}
            />

            <Row
              label="Subtotal"
              value={`₹${booking.subtotal}`}
            />

            <Row
              label="Discount"
              value={`₹${booking.discount}`}
            />

            <Row
              label="Total"
              value={`₹${booking.totalAmount}`}
              bold
            />

            <Row
              label="Payment"
              value={
                booking.paymentMethod
              }
            />

            <div className="border-t pt-4">
              <Status
                label="Booking Status"
                value={
                  booking.status
                }
              />

              <Status
                label="Payment Status"
                value={
                  booking.paymentStatus
                }
              />
            </div>

            {booking.paymentMethod ===
              "ONLINE" &&
              booking.paymentStatus ===
                "pending" &&
              booking.status !==
                "cancelled" && (
                <div className="pt-4">
                  <PaymentButton
                    booking={
                      booking
                    }
                    onSuccess={
                      handlePaymentSuccess
                    }
                  />
                </div>
              )}

            {booking.status !==
              "cancelled" &&
              booking.status !==
                "completed" &&
              booking.status !==
                "active" && (
                <button
                  onClick={
                    handleCancel
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-red-600"
                >
                  <XCircle
                    size={18}
                  />
                  Cancel Booking
                </button>
              )}

            {booking.paymentStatus ===
              "paid" && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                <CheckCircle
                  size={20}
                />
                Payment completed
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({
  label,
  value,
  bold = false,
}) => (
  <div className="flex justify-between gap-4">
    <span className="text-slate-500">
      {label}
    </span>

    <span
      className={
        bold
          ? "font-bold text-blue-600"
          : "font-medium"
      }
    >
      {value}
    </span>
  </div>
);

const Status = ({
  label,
  value,
}) => (
  <div className="mt-3 flex justify-between">
    <span className="text-slate-500">
      {label}
    </span>

    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize">
      {value}
    </span>
  </div>
);

export default BookingDetails;