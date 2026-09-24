import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bike,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import api from "../../services/api";

const statuses = ["pending", "confirmed", "active", "completed", "cancelled"];

const AdminBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchBooking = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/admin/bookings/${id}`);
      setBooking(response.data.booking);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to load booking details.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      const response = await api.put(`/admin/bookings/${id}/status`, { status });
      setBooking((current) => ({ ...current, ...response.data.booking }));
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Failed to update booking status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center gap-3 text-slate-600">
        <Loader2 size={24} className="animate-spin" />
        Loading booking details...
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Booking not found</h1>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white"
          >
            Back to bookings
          </button>
        </div>
      </div>
    );
  }

  const user = booking.user || {};
  const bike = booking.bike || {};

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to bookings
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Admin panel / Booking
            </p>
            <h1 className="mt-1 break-all text-2xl font-black text-slate-900">
              #{booking._id}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Created {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-bold capitalize text-blue-700">
            {booking.status}
          </span>
        </div>

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-6">
            <InfoSection title="Customer details" icon={<User size={19} />}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Detail label="Full name" value={user.name || "-"} />
                <Detail label="Email" value={user.email || "-"} icon={<Mail size={15} />} />
                <Detail label="Phone" value={user.phone || "Not provided"} icon={<Phone size={15} />} />
                <Detail label="User ID" value={user._id || "-"} />
              </div>
            </InfoSection>

            <InfoSection title="Bike details" icon={<Bike size={19} />}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-44 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-48">
                  {bike.image ? (
                    <img src={bike.image} alt={bike.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Bike size={40} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{bike.brand || "-"}</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">{bike.name || "-"}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} /> {bike.location || "Location unavailable"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Model: {bike.model || "-"}</p>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Rental details" icon={<CalendarDays size={19} />}>
              <div className="grid gap-3 sm:grid-cols-3">
                <Detail label="Start date" value={formatDate(booking.startDate)} />
                <Detail label="End date" value={formatDate(booking.endDate)} />
                <Detail label="Duration" value={`${booking.totalDays || 0} day${booking.totalDays === 1 ? "" : "s"}`} />
              </div>
            </InfoSection>
          </div>

          <div className="space-y-6">
            <InfoSection title="Payment summary" icon={<CreditCard size={19} />}>
              <div className="space-y-4 text-sm">
                <Detail label="Payment method" value={booking.paymentMethod || "-"} />
                <Detail label="Payment status" value={booking.paymentStatus || "pending"} />
                <Detail label="Subtotal" value={`₹${Number(booking.subtotal || 0).toLocaleString("en-IN")}`} icon={<IndianRupee size={15} />} />
                <Detail label="Discount" value={`₹${Number(booking.discount || 0).toLocaleString("en-IN")}`} />
                <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="font-bold text-slate-900">Total amount</span>
                  <span className="text-2xl font-black text-blue-600">₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Update booking status" icon={<CheckCircle2 size={19} />}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {statuses.map((status) => (
                  <button
                    key={status}
                    disabled={updating}
                    onClick={() => updateStatus(status)}
                    className={`rounded-lg px-3 py-2.5 text-xs font-bold capitalize ${booking.status === status ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"} disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </InfoSection>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoSection = ({ title, icon, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="flex items-center gap-2 text-blue-600">
      {icon}
      <h2 className="font-black text-slate-900">{title}</h2>
    </div>
    <div className="mt-5">{children}</div>
  </div>
);

const Detail = ({ label, value, icon }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      {icon}
      {label}
    </p>
    <p className="mt-1 break-all text-sm font-bold text-slate-900">{value}</p>
  </div>
);

export default AdminBookingDetails;