import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  MapPin,
  XCircle,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";

import api from "../services/api";

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const paymentSuccess = location.state?.paymentSuccess;

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/bookings/${id}`);

      setBooking(response.data.booking);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load booking details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      setCancelling(true);
      setError("");

      await api.put(`/bookings/${id}/cancel`);

      await fetchBooking();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleRetryPayment = () => {
    navigate(`/payment/${id}`, {
      state: {
        booking,
      },
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "active":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "completed":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const getPaymentClasses = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-700";

      case "failed":
        return "bg-red-50 text-red-700";

      case "refunded":
        return "bg-purple-50 text-purple-700";

      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="animate-spin" size={24} />
          <span>Loading booking...</span>
        </div>
      </section>
    );
  }

  if (error && !booking) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Booking Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <Link
            to="/bookings"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Bookings
          </Link>
        </div>
      </section>
    );
  }

  if (!booking) return null;

  const bike =
    typeof booking.bike === "object"
      ? booking.bike
      : null;

  return (
    <section className="bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to My Bookings
        </Link>

        {/* Payment Success */}
        {paymentSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2 size={22} />

            <div>
              <p className="font-bold">
                Payment successful!
              </p>

              <p className="text-sm">
                Your booking has been confirmed.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />

            <p className="text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Booking ID
            </p>

            <h1 className="mt-1 break-all text-xl font-black text-slate-900 sm:text-2xl">
              #{booking._id}
            </h1>
          </div>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT */}
          <div className="space-y-6 lg:col-span-2">

            {/* Bike Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Bike className="text-blue-600" size={20} />

                  <h2 className="font-black text-slate-900">
                    Bike Details
                  </h2>
                </div>

                <div className="mt-5 flex flex-col gap-5 sm:flex-row">
                  <div className="h-48 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-36 sm:w-52">
                    {bike?.image ? (
                      <img
                        src={bike.image}
                        alt={bike.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Bike size={40} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-blue-600">
                      {bike?.brand || "RideX"}
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-900">
                      {bike?.name || "Bike"}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin size={16} className="text-blue-600" />
                      {bike?.location || "Location unavailable"}
                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      ₹{booking.pricePerDay?.toLocaleString("en-IN")}
                      /day
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CalendarDays
                  className="text-blue-600"
                  size={20}
                />

                <h2 className="font-black text-slate-900">
                  Rental Details
                </h2>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">

                <DetailItem
                  icon={<CalendarDays size={18} />}
                  label="Start Date"
                  value={formatDate(booking.startDate)}
                />

                <DetailItem
                  icon={<CalendarDays size={18} />}
                  label="End Date"
                  value={formatDate(booking.endDate)}
                />

                <DetailItem
                  icon={<Clock3 size={18} />}
                  label="Duration"
                  value={`${booking.totalDays} ${
                    booking.totalDays === 1
                      ? "Day"
                      : "Days"
                  }`}
                />

              </div>
            </div>

            {/* Booking Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="font-black text-slate-900">
                Booking Status
              </h2>

              <div className="mt-6 space-y-5">

                <TimelineItem
                  title="Booking Created"
                  active
                  description={formatDateTime(
                    booking.createdAt
                  )}
                />

                <TimelineItem
                  title="Payment"
                  active={booking.paymentStatus === "paid"}
                  description={
                    booking.paymentStatus === "paid"
                      ? "Payment completed"
                      : `Payment ${booking.paymentStatus}`
                  }
                />

                <TimelineItem
                  title="Booking Confirmed"
                  active={[
                    "confirmed",
                    "active",
                    "completed",
                  ].includes(booking.status)}
                  description={
                    booking.status === "pending"
                      ? "Waiting for payment confirmation"
                      : "Booking confirmed"
                  }
                />

                <TimelineItem
                  title="Rental Completed"
                  active={booking.status === "completed"}
                  description={
                    booking.status === "completed"
                      ? "Rental completed"
                      : "Not completed yet"
                  }
                  last
                />

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Price Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <IndianRupee
                  className="text-blue-600"
                  size={20}
                />

                <h2 className="font-black text-slate-900">
                  Price Summary
                </h2>
              </div>

              <div className="mt-5 space-y-4 text-sm">

                <PriceRow
                  label={`${booking.totalDays} days × ₹${booking.pricePerDay}`}
                  value={booking.subtotal}
                />

                {booking.discount > 0 && (
                  <PriceRow
                    label={`Discount ${
                      booking.couponCode
                        ? `(${booking.couponCode})`
                        : ""
                    }`}
                    value={-booking.discount}
                    discount
                  />
                )}

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Total Amount
                    </span>

                    <span className="text-xl font-black text-blue-600">
                      ₹
                      {booking.totalAmount?.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <CreditCard
                  className="text-blue-600"
                  size={20}
                />

                <h2 className="font-black text-slate-900">
                  Payment
                </h2>
              </div>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Method
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {booking.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getPaymentClasses(
                      booking.paymentStatus
                    )}`}
                  >
                    {booking.paymentStatus}
                  </span>
                </div>

              </div>
            </div>

            {/* Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="font-black text-slate-900">
                Actions
              </h2>

              <div className="mt-5 space-y-3">

                {/* Retry Payment */}
                {booking.paymentMethod === "ONLINE" &&
                  booking.paymentStatus === "pending" &&
                  booking.status !== "cancelled" && (
                    <button
                      onClick={handleRetryPayment}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      <RotateCcw size={17} />
                      Complete Payment
                    </button>
                  )}

                {/* Cancel */}
                {["pending", "confirmed"].includes(
                  booking.status
                ) && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancelling ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle size={17} />
                        Cancel Booking
                      </>
                    )}
                  </button>
                )}

                <Link
                  to="/bookings"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  View All Bookings
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- Detail Item ---------------- */

const DetailItem = ({ icon, label, value }) => {
  return (
    <div>
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
};

/* ---------------- Price Row ---------------- */

const PriceRow = ({
  label,
  value,
  discount = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">
        {label}
      </span>

      <span
        className={`font-bold ${
          discount
            ? "text-emerald-600"
            : "text-slate-900"
        }`}
      >
        {discount && "-"}₹
        {Math.abs(value || 0).toLocaleString("en-IN")}
      </span>
    </div>
  );
};

/* ---------------- Timeline Item ---------------- */

const TimelineItem = ({
  title,
  description,
  active,
  last = false,
}) => {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-[9px] top-5 h-full w-px ${
            active
              ? "bg-blue-200"
              : "bg-slate-200"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          active
            ? "bg-blue-600 text-white"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {active && <CheckCircle2 size={14} />}
      </div>

      <div className="pb-5">
        <p
          className={`text-sm font-bold ${
            active
              ? "text-slate-900"
              : "text-slate-400"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;