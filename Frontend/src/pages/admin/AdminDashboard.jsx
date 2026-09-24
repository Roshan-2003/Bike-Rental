import { useEffect, useState } from "react";
import {
  Users,
  Bike,
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  BarChart3,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    bikes: 0,
    bookings: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/dashboard");

      setStats(
        response.data.stats || {
          users: 0,
          bikes: 0,
          bookings: 0,
          revenue: 0,
        }
      );

      setRecentBookings(
        response.data.recentBookings || []
      );
    } catch (error) {
      console.error("Dashboard error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);



  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700";

      case "active":
        return "bg-blue-50 text-blue-700";

      case "completed":
        return "bg-purple-50 text-purple-700";

      case "cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin"
          />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              ADMIN PANEL
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your RideX bike rental platform.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="text-sm font-semibold">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="rounded-lg bg-white px-3 py-2 text-xs font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Users"
            value={stats.users}
            icon={<Users size={22} />}
            description="Registered customers"
          />

          <StatCard
            title="Total Bikes"
            value={stats.bikes}
            icon={<Bike size={22} />}
            description="Bikes in system"
          />

          <StatCard
            title="Total Bookings"
            value={stats.bookings}
            icon={<CalendarCheck size={22} />}
            description="All rental bookings"
          />

          <StatCard
            title="Total Revenue"
            value={`₹${Number(
              stats.revenue || 0
            ).toLocaleString("en-IN")}`}
            icon={<IndianRupee size={22} />}
            description="Paid bookings"
          />

        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-black text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <QuickAction
              to="/admin/bikes"
              icon={<Bike size={21} />}
              title="Manage Bikes"
              description="Add or edit bikes"
            />

            <QuickAction
              to="/admin/bookings"
              icon={<CalendarCheck size={21} />}
              title="Manage Bookings"
              description="View rental bookings"
            />

            <QuickAction
              to="/admin/users"
              icon={<Users size={21} />}
              title="Manage Users"
              description="View customers"
            />

            <QuickAction
              to="/admin/coupons"
              icon={<TrendingUp size={21} />}
              title="Manage Coupons"
              description="Create discount codes"
            />

            <QuickAction
              to="/admin/reports"
              icon={<BarChart3 size={21} />}
              title="Reports & Analytics"
              description="View revenue and booking analytics"
            />

          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
            <div>
              <h2 className="font-black text-slate-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Latest rental activity
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View All
              <ArrowRight size={15} />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CalendarCheck
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No bookings found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="flex items-center gap-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      {booking.bike?.image ? (
                        <img
                          src={booking.bike.image}
                          alt={booking.bike.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Bike
                          size={21}
                          className="text-slate-400"
                        />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {booking.bike?.name ||
                          "Bike"}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {booking.user?.name ||
                          "User"}{" "}
                        •{" "}
                        {formatDate(
                          booking.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">

                    <div>
                      <p className="text-xs text-slate-400">
                        Amount
                      </p>

                      <p className="font-black text-slate-900">
                        ₹
                        {Number(
                          booking.totalAmount || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <Link
                      to={`/admin/bookings/${booking._id}`}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <ArrowRight size={17} />
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

/* ---------------- Stat Card ---------------- */

const StatCard = ({
  title,
  value,
  icon,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-black text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Quick Action ---------------- */

const QuickAction = ({
  to,
  icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          {icon}
        </div>

        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

      </div>
    </Link>
  );
};

export default AdminDashboard;