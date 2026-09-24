import { useEffect, useState } from "react";

import {
  RefreshCw,
  IndianRupee,
  CalendarDays,
  CreditCard,
  XCircle,
  Bike,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import api from "../../services/api";

const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/admin/reports"
      );

      setReport(data);
    } catch (error) {
      console.error(
        "Fetch reports error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  const getMonthName = (month) => {
    const date = new Date(2026, month - 1);

    return date.toLocaleString("en-IN", {
      month: "short",
    });
  };

  const monthlyChartData =
    report?.monthlyRevenue?.map((item) => ({
      month: `${getMonthName(
        item._id.month
      )} ${item._id.year}`,
      revenue: item.revenue,
      bookings: item.bookings,
    })) || [];

  const bookingChartData =
    report?.bookingStats?.map((item) => ({
      status: item._id,
      bookings: item.count,
    })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10">

        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-12 text-center">

          <RefreshCw
            size={30}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-3 text-sm text-slate-500">
            Loading reports...
          </p>

        </div>

      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-center">
        <p className="text-slate-500">
          Failed to load reports.
        </p>

        <button
          onClick={fetchReports}
          className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

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
              Reports & Analytics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor revenue, bookings and rental performance.
            </p>
          </div>

          <button
            onClick={fetchReports}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Revenue */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Revenue
                </p>

                <p className="mt-2 text-2xl font-black text-slate-900">
                  ₹
                  {formatCurrency(
                    report.summary.totalRevenue
                  )}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <IndianRupee size={21} />
              </div>

            </div>

          </div>

          {/* Bookings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Total Bookings
                </p>

                <p className="mt-2 text-2xl font-black text-slate-900">
                  {report.summary.totalBookings}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <CalendarDays size={21} />
              </div>

            </div>

          </div>

          {/* Paid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Paid Bookings
                </p>

                <p className="mt-2 text-2xl font-black text-slate-900">
                  {report.summary.paidBookings}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <CreditCard size={21} />
              </div>

            </div>

          </div>

          {/* Cancelled */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Cancelled
                </p>

                <p className="mt-2 text-2xl font-black text-slate-900">
                  {report.summary.cancelledBookings}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">
                <XCircle size={21} />
              </div>

            </div>

          </div>

        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Revenue Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div>
              <h2 className="font-black text-slate-900">
                Monthly Revenue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue generated from paid bookings.
              </p>
            </div>

            <div className="mt-6 h-[320px]">

              {monthlyChartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={monthlyChartData}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 12,
                      }}
                    />

                    <Tooltip
                      formatter={(value) =>
                        `₹${formatCurrency(
                          value
                        )}`
                      }
                    />

                    <Bar
                      dataKey="revenue"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No revenue data available.
                </div>
              )}

            </div>

          </div>

          {/* Booking Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div>
              <h2 className="font-black text-slate-900">
                Booking Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current booking distribution.
              </p>
            </div>

            <div className="mt-6 h-[320px]">

              {bookingChartData.length > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <BarChart
                    data={bookingChartData}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      type="number"
                      allowDecimals={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="status"
                      width={80}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="bookings"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No booking data available.
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Popular Bikes */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div>
            <h2 className="font-black text-slate-900">
              Most Rented Bikes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Bikes with the highest number of bookings.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto">

            <table className="w-full min-w-[650px] text-left">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bike
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bookings
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Revenue
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {report.popularBikes.length > 0 ? (
                  report.popularBikes.map(
                    (bike) => (
                      <tr
                        key={bike._id}
                        className="hover:bg-slate-50"
                      >

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-100">

                              {bike.image ? (
                                <img
                                  src={bike.image}
                                  alt={bike.name}
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
                                {bike.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                {bike.brand}
                              </p>
                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            {bike.totalBookings}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <p className="font-black text-slate-900">
                            ₹
                            {formatCurrency(
                              bike.revenue
                            )}
                          </p>

                        </td>

                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-4 py-10 text-center text-sm text-slate-400"
                    >
                      No bike booking data available.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Payment Statistics */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-black text-slate-900">
            Payment Overview
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            {report.paymentStats.map(
              (payment) => (
                <div
                  key={payment._id}
                  className="rounded-xl bg-slate-50 p-4"
                >

                  <p className="text-xs font-bold uppercase text-slate-500">
                    {payment._id}
                  </p>

                  <p className="mt-2 text-xl font-black text-slate-900">
                    {payment.count}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    ₹
                    {formatCurrency(
                      payment.amount
                    )}
                  </p>

                </div>
              )
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminReports;