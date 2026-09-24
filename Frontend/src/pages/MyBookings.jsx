import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Bike,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("all");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bookings");

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load your bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") {
      return true;
    }

    return booking.status === activeTab;
  });

  const tabs = [
    {
      key: "all",
      label: "All",
    },
    {
      key: "pending",
      label: "Pending",
    },
    {
      key: "confirmed",
      label: "Confirmed",
    },
    {
      key: "active",
      label: "Active",
    },
    {
      key: "completed",
      label: "Completed",
    },
    {
      key: "cancelled",
      label: "Cancelled",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                My Account
              </p>

              <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
                My Bookings
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage and track all your bike rentals.
              </p>
            </div>

            <button
              onClick={fetchBookings}
              disabled={loading}
              className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>

          </div>

        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Tabs */}
        <div className="mb-7 overflow-x-auto">
          <div className="flex min-w-max gap-2 rounded-xl border border-slate-200 bg-white p-1.5">

            {tabs.map((tab) => {
              const count =
                tab.key === "all"
                  ? bookings.length
                  : bookings.filter(
                      (booking) =>
                        booking.status === tab.key
                    ).length;

              return (
                <button
                  key={tab.key}
                  onClick={() =>
                    setActiveTab(tab.key)
                  }
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {tab.label}

                  <span
                    className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading your bookings...
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">

            <p className="text-sm font-medium text-red-600">
              {error}
            </p>

            <button
              onClick={fetchBookings}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredBookings.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-20 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Bike size={30} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No Bookings Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                You don't have any bookings in this category.
                Find a bike and start your journey today.
              </p>

              <Link
                to="/bikes"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Browse Bikes
              </Link>

            </div>
          )}

        {/* Booking List */}
        {!loading &&
          !error &&
          filteredBookings.length > 0 && (
            <div className="space-y-5">

              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking._id}
                  booking={booking}
                />
              ))}

            </div>
          )}

      </section>
    </div>
  );
};

/* --------------------------------
   Booking Card
-------------------------------- */

const BookingCard = ({ booking }) => {
  const bike =
    typeof booking.bike === "object"
      ? booking.bike
      : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

      <div className="flex flex-col lg:flex-row">

        {/* Bike Image */}
        <div className="relative h-56 w-full shrink-0 bg-slate-100 sm:h-64 lg:h-auto lg:w-72">

          {bike?.image ? (
            <img
              src={bike.image}
              alt={bike.name || "Bike"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              <Bike size={45} />
            </div>
          )}

          <StatusBadge
            status={booking.status}
          />

        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">

          {/* Top */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {bike?.brand || "RideX"}
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                {bike?.name || "Bike Rental"}
              </h2>

              {bike?.location && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin size={15} />
                  {bike.location}
                </div>
              )}
            </div>

            <div className="sm:text-right">
              <p className="text-xs text-slate-400">
                Total Amount
              </p>

              <p className="mt-1 text-2xl font-black text-blue-600">
                ₹{booking.totalAmount}
              </p>
            </div>

          </div>

          {/* Booking Details */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">

            <DetailItem
              icon={<CalendarDays size={17} />}
              label="Start Date"
              value={formatDate(booking.startDate)}
            />

            <DetailItem
              icon={<CalendarDays size={17} />}
              label="End Date"
              value={formatDate(booking.endDate)}
            />

            <DetailItem
              icon={<Clock3 size={17} />}
              label="Duration"
              value={`${booking.totalDays} ${
                booking.totalDays === 1
                  ? "Day"
                  : "Days"
              }`}
            />

          </div>

          {/* Bottom */}
          <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">

            <div className="flex flex-wrap gap-3">

              <PaymentBadge
                status={booking.paymentStatus}
              />

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {booking.paymentMethod}
              </span>

            </div>

            <Link
              to={`/bookings/${booking._id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              View Details
              <ChevronRight size={17} />
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

/* --------------------------------
   Status Badge
-------------------------------- */

const StatusBadge = ({ status }) => {
  const styles = {
    pending:
      "bg-amber-500 text-white",

    confirmed:
      "bg-blue-600 text-white",

    active:
      "bg-emerald-500 text-white",

    completed:
      "bg-slate-700 text-white",

    cancelled:
      "bg-red-500 text-white",
  };

  return (
    <span
      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
        styles[status] ||
        "bg-slate-600 text-white"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
};

/* --------------------------------
   Payment Badge
-------------------------------- */

const PaymentBadge = ({ status }) => {
  const styles = {
    paid: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    failed: "bg-red-50 text-red-600",
    refunded: "bg-purple-50 text-purple-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      Payment: {status || "pending"}
    </span>
  );
};

/* --------------------------------
   Detail Item
-------------------------------- */

const DetailItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-800">
        {value}
      </p>

    </div>
  );
};

/* --------------------------------
   Format Date
-------------------------------- */

const formatDate = (date) => {
  if (!date) {
    return "N/A";
  }

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

export default MyBookings;