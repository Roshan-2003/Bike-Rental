import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  Bike,
  User,
  CalendarDays,
  IndianRupee,
} from "lucide-react";
import api from "../../services/api";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== "all") {
        params.status = status;
      }

      const { data } = await api.get("/admin/bookings", {
        params,
      });

      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Fetch admin bookings error:", error);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);

      const { data } = await api.put(
        `/admin/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? data.booking
            : booking
        )
      );

      setSelectedBooking(data.booking);
    } catch (error) {
      console.error("Update status error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update booking status"
      );
    } finally {
      setUpdatingId(null);
    }
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

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              ADMIN PANEL
            </p>

            <h1 className="mt-1 text-2xl font-black text-slate-900">
              Manage Bookings
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage all customer bookings.
            </p>
          </div>

          <button
            onClick={fetchBookings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">

            <form
              onSubmit={handleSearch}
              className="flex flex-1 gap-2"
            >
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search user, email or bike..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="active">
                Active
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* Booking Count */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-500">
            {bookings.length} booking
            {bookings.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading bookings...
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <CalendarDays
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No bookings found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">

                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Bike
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Dates
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <User size={18} />
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {booking.user?.name ||
                                "Unknown User"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {booking.user?.email ||
                                "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Bike */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-100">
                            {booking.bike?.image ? (
                              <img
                                src={booking.bike.image}
                                alt={booking.bike.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Bike
                                  size={20}
                                  className="text-slate-400"
                                />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">
                              {booking.bike?.name ||
                                "Unknown Bike"}
                            </p>

                            <p className="text-xs text-slate-500">
                              {booking.bike?.brand || "-"}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {formatDate(
                            booking.startDate
                          )}
                        </p>

                        <p className="text-xs text-slate-500">
                          to{" "}
                          {formatDate(
                            booking.endDate
                          )}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-blue-600">
                          {booking.totalDays} day
                          {booking.totalDays !== 1
                            ? "s"
                            : ""}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 font-black text-slate-900">
                          <IndianRupee size={15} />

                          {Number(
                            booking.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </div>

                        {booking.discount > 0 && (
                          <p className="text-xs text-emerald-600">
                            Discount ₹
                            {booking.discount}
                          </p>
                        )}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {booking.paymentMethod ||
                            "-"}
                        </p>

                        <p
                          className={`mt-1 text-xs font-bold ${
                            booking.paymentStatus ===
                            "paid"
                              ? "text-emerald-600"
                              : booking.paymentStatus ===
                                "failed"
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {booking.paymentStatus ||
                            "pending"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            statusStyles[
                              booking.status
                            ] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            setSelectedBooking(
                              booking
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Booking Details
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  #{selectedBooking._id.slice(-8)}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-6">

              {/* Customer */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Customer
                </h3>

                <div className="mt-3 rounded-xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">
                    {selectedBooking.user?.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedBooking.user?.email}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedBooking.user?.phone ||
                      "No phone"}
                  </p>
                </div>
              </div>

              {/* Bike */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Bike
                </h3>

                <div className="mt-3 flex gap-4 rounded-xl bg-slate-50 p-4">
                  <div className="h-20 w-28 overflow-hidden rounded-lg bg-white">
                    {selectedBooking.bike?.image ? (
                      <img
                        src={
                          selectedBooking.bike.image
                        }
                        alt={
                          selectedBooking.bike.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Bike className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedBooking.bike?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {selectedBooking.bike?.brand}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedBooking.bike?.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Booking Information
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Start Date
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {formatDateTime(
                        selectedBooking.startDate
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      End Date
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {formatDateTime(
                        selectedBooking.endDate
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Total Days
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      {selectedBooking.totalDays}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Price / Day
                    </p>

                    <p className="mt-1 font-bold text-slate-900">
                      ₹
                      {selectedBooking.pricePerDay}
                    </p>
                  </div>

                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Payment
                </h3>

                <div className="mt-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Payment Method
                    </span>

                    <span className="font-bold text-slate-900">
                      {selectedBooking.paymentMethod}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      Payment Status
                    </span>

                    <span className="font-bold capitalize text-slate-900">
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="font-bold text-slate-700">
                      Total Amount
                    </span>

                    <span className="text-xl font-black text-blue-600">
                      ₹
                      {Number(
                        selectedBooking.totalAmount
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-bold text-slate-900">
                  Update Booking Status
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">

                  {[
                    "pending",
                    "confirmed",
                    "active",
                    "completed",
                    "cancelled",
                  ].map((item) => (
                    <button
                      key={item}
                      disabled={
                        updatingId ===
                        selectedBooking._id
                      }
                      onClick={() =>
                        updateStatus(
                          selectedBooking._id,
                          item
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition ${
                        selectedBooking.status ===
                        item
                          ? statusStyles[item]
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {item}
                    </button>
                  ))}

                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;