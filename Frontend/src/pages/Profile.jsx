import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Heart,
  ClipboardList,
} from "lucide-react";

import api from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    bookings: 0,
    completed: 0,
    active: 0,
    wishlist: 0,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users/profile");

      const user = response.data.user;

      setProfile(user);

      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [bookingsResponse, wishlistResponse] =
        await Promise.all([
          api.get("/bookings"),
          api.get("/wishlist"),
        ]);

      const bookings =
        bookingsResponse.data.bookings || [];

      const wishlist =
        wishlistResponse.data.wishlist || [];

      setStats({
        bookings: bookings.length,

        completed: bookings.filter(
          (booking) =>
            booking.status === "completed"
        ).length,

        active: bookings.filter(
          (booking) =>
            booking.status === "active" ||
            booking.status === "confirmed"
        ).length,

        wishlist: wishlist.length,
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      setMessage("");
      setError("");

      const response = await api.put(
        "/users/profile",
        {
          name: formData.name,
          phone: formData.phone,
        }
      );

      const updatedUser = response.data.user;

      setProfile(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("Please fill all password fields.");
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setChangingPassword(true);
      setMessage("");
      setError("");

      await api.put("/users/change-password", {
        currentPassword:
          passwordData.currentPassword,

        newPassword:
          passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        "Password changed successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2
            size={24}
            className="animate-spin"
          />
          <span>Loading profile...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            ACCOUNT
          </p>

          <h1 className="mt-1 text-3xl font-black text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and
            account settings.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2 size={20} />

            <p className="text-sm font-semibold">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />

            <p className="text-sm font-semibold">
              {error}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT PROFILE */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col items-center text-center">

                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-blue-600">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={42} />
                  )}
                </div>

                <h2 className="mt-4 text-xl font-black text-slate-900">
                  {profile?.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {profile?.email}
                </p>

                <span className="mt-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-600">
                  {profile?.role || "user"}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="font-black text-slate-900">
                Account Overview
              </h2>

              <div className="mt-5 space-y-4">

                <StatRow
                  icon={<ClipboardList size={18} />}
                  label="Total Bookings"
                  value={stats.bookings}
                />

                <StatRow
                  icon={<CheckCircle2 size={18} />}
                  label="Completed"
                  value={stats.completed}
                />

                <StatRow
                  icon={<CalendarDays size={18} />}
                  label="Active Bookings"
                  value={stats.active}
                />

                <StatRow
                  icon={<Heart size={18} />}
                  label="Wishlist"
                  value={stats.wishlist}
                />

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 lg:col-span-2">

            {/* Personal Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6">
                <h2 className="text-lg font-black text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal details.
                </p>
              </div>

              <form
                onSubmit={handleUpdateProfile}
                className="space-y-5"
              >

                {/* Name */}
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User size={18} />}
                  placeholder="Enter your name"
                  required
                />

                {/* Email */}
                <InputField
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  icon={<Mail size={18} />}
                  placeholder="Enter your email"
                  type="email"
                  disabled
                />

                {/* Phone */}
                <InputField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone size={18} />}
                  placeholder="Enter your phone number"
                />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updating ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <Lock
                    size={20}
                    className="text-blue-600"
                  />

                  <h2 className="text-lg font-black text-slate-900">
                    Change Password
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Use a strong password to keep your
                  account secure.
                </p>
              </div>

              <form
                onSubmit={handleChangePassword}
                className="space-y-5"
              >

                <InputField
                  label="Current Password"
                  name="currentPassword"
                  value={
                    passwordData.currentPassword
                  }
                  onChange={handlePasswordChange}
                  icon={<Lock size={18} />}
                  placeholder="Enter current password"
                  type="password"
                  required
                />

                <InputField
                  label="New Password"
                  name="newPassword"
                  value={
                    passwordData.newPassword
                  }
                  onChange={handlePasswordChange}
                  icon={<Lock size={18} />}
                  placeholder="Enter new password"
                  type="password"
                  required
                />

                <InputField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={
                    passwordData.confirmPassword
                  }
                  onChange={handlePasswordChange}
                  icon={<Lock size={18} />}
                  placeholder="Confirm new password"
                  type="password"
                  required
                />

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock size={17} />
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- Input ---------------- */

const InputField = ({
  label,
  name,
  value,
  onChange,
  icon,
  placeholder,
  type = "text",
  disabled = false,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
    </div>
  );
};

/* ---------------- Stats ---------------- */

const StatRow = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-sm font-medium text-slate-600">
          {label}
        </span>
      </div>

      <span className="font-black text-slate-900">
        {value}
      </span>
    </div>
  );
};

export default Profile;