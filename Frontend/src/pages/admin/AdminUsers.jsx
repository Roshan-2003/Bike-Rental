import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  X,
  User,
  Mail,
  Phone,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [userDetails, setUserDetails] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (role !== "all") {
        params.role = role;
      }

      const { data } = await api.get(
        "/admin/users",
        { params }
      );

      setUsers(data.users || []);
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const openUserDetails = async (userId) => {
    try {
      setSelectedUser(userId);
      setDetailsLoading(true);

      const { data } = await api.get(
        `/admin/users/${userId}`
      );

      setUserDetails(data);
    } catch (error) {
      console.error(
        "Fetch user details error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load user details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
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
              Manage Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View and manage registered users.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
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
                  placeholder="Search name, email or phone..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="all">
                All Users
              </option>

              <option value="user">
                Users
              </option>

              <option value="admin">
                Admins
              </option>
            </select>

          </div>

        </div>

        {/* Count */}
        <div className="mt-5">
          <p className="text-sm font-semibold text-slate-500">
            {users.length} user
            {users.length !== 1 ? "s" : ""}
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
              Loading users...
            </p>

          </div>
        ) : users.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">

            <User
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search.
            </p>

          </div>
        ) : (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">

                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-slate-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <User size={18} />
                          </div>

                          <div>

                            <p className="font-bold text-slate-900">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone size={15} />
                          {user.phone || "Not provided"}
                        </div>

                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                      {/* Joined */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-slate-700">
                          {formatDate(
                            user.createdAt
                          )}
                        </p>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            openUserDetails(
                              user._id
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  User Details
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Customer Profile
                </h2>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(null);
                  setUserDetails(null);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            {detailsLoading ? (
              <div className="p-12 text-center">

                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-blue-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading user details...
                </p>

              </div>
            ) : userDetails ? (
              <div className="space-y-6 p-6">

                {/* Profile */}
                <div className="rounded-2xl bg-slate-50 p-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User size={28} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {userDetails.user.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {userDetails.user.email}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">

                    <div className="rounded-xl bg-white p-4">
                      <Mail
                        size={18}
                        className="text-blue-600"
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Email
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-slate-900">
                        {userDetails.user.email}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                      <Phone
                        size={18}
                        className="text-blue-600"
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {userDetails.user.phone ||
                          "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-4">
                      <CalendarDays
                        size={18}
                        className="text-blue-600"
                      />

                      <p className="mt-2 text-xs text-slate-500">
                        Joined
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {formatDate(
                          userDetails.user.createdAt
                        )}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500">
                      Total Bookings
                    </p>

                    <p className="mt-2 text-3xl font-black text-slate-900">
                      {
                        userDetails.stats
                          .totalBookings
                      }
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="text-sm text-slate-500">
                      Total Spent
                    </p>

                    <p className="mt-2 flex items-center text-3xl font-black text-blue-600">
                      <IndianRupee size={24} />

                      {Number(
                        userDetails.stats
                          .totalSpent
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>

                {/* Booking History */}
                <div>

                  <h3 className="font-black text-slate-900">
                    Booking History
                  </h3>

                  <div className="mt-3 space-y-3">

                    {userDetails.bookings
                      ?.length > 0 ? (
                      userDetails.bookings.map(
                        (booking) => (
                          <div
                            key={booking._id}
                            className="rounded-xl border border-slate-200 p-4"
                          >

                            <div className="flex flex-col justify-between gap-3 sm:flex-row">

                              <div>
                                <p className="font-bold text-slate-900">
                                  {
                                    booking.bike
                                      ?.name
                                  }
                                </p>

                                <p className="text-sm text-slate-500">
                                  {
                                    booking.bike
                                      ?.brand
                                  }
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                  {formatDate(
                                    booking.startDate
                                  )}{" "}
                                  →{" "}
                                  {formatDate(
                                    booking.endDate
                                  )}
                                </p>
                              </div>

                              <div className="text-left sm:text-right">

                                <p className="font-black text-slate-900">
                                  ₹
                                  {Number(
                                    booking.totalAmount ||
                                      0
                                  ).toLocaleString(
                                    "en-IN"
                                  )}
                                </p>

                                <span className="mt-1 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-600">
                                  {
                                    booking.status
                                  }
                                </span>

                              </div>

                            </div>

                          </div>
                        )
                      )
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                        No bookings found.
                      </div>
                    )}

                  </div>

                </div>

              </div>
            ) : null}

          </div>

        </div>
      )}
    </div>
  );
};

export default AdminUsers;