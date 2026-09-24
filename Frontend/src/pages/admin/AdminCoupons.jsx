import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  X,
  Tag,
} from "lucide-react";

import api from "../../services/api";

const emptyForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minBookingAmount: "",
  maxDiscount: "",
  expiryDate: "",
  usageLimit: "",
  active: true,
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCoupon, setEditingCoupon] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      const { data } = await api.get(
        "/admin/coupons",
        { params }
      );

      setCoupons(data.coupons || []);
    } catch (error) {
      console.error("Fetch coupons error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCoupons();
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);

    setForm({
      code: coupon.code || "",
      discountType:
        coupon.discountType || "percentage",
      discountValue:
        coupon.discountValue || "",
      minBookingAmount:
        coupon.minBookingAmount || "",
      maxDiscount:
        coupon.maxDiscount || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate)
            .toISOString()
            .split("T")[0]
        : "",
      usageLimit:
        coupon.usageLimit || "",
      active: coupon.active,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(
          form.discountValue
        ),
        minBookingAmount: Number(
          form.minBookingAmount || 0
        ),
        maxDiscount: Number(
          form.maxDiscount || 0
        ),
        expiryDate: form.expiryDate,
        usageLimit: Number(
          form.usageLimit || 0
        ),
        active: form.active,
      };

      if (editingCoupon) {
        await api.put(
          `/admin/coupons/${editingCoupon._id}`,
          payload
        );
      } else {
        await api.post(
          "/admin/coupons",
          payload
        );
      }

      setShowModal(false);
      setEditingCoupon(null);
      setForm(emptyForm);

      await fetchCoupons();

    } catch (error) {
      console.error(
        "Save coupon error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save coupon"
      );
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.put(
        `/admin/coupons/${id}/toggle`
      );

      await fetchCoupons();
    } catch (error) {
      console.error(
        "Toggle coupon error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update coupon"
      );
    }
  };

  const deleteCoupon = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/admin/coupons/${id}`
      );

      await fetchCoupons();
    } catch (error) {
      console.error(
        "Delete coupon error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete coupon"
      );
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

  const isExpired = (date) => {
    return new Date(date) < new Date();
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
              Manage Coupons
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage booking discount coupons.
            </p>
          </div>

          <div className="flex gap-2">

            <button
              onClick={fetchCoupons}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Coupon
            </button>

          </div>

        </div>

        {/* Search */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <form
            onSubmit={handleSearch}
            className="flex gap-2"
          >
            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search coupon code..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Search
            </button>

          </form>

        </div>

        {/* Coupons */}
        {loading ? (
          <div className="mt-6 rounded-2xl bg-white p-12 text-center">

            <RefreshCw
              size={28}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-slate-500">
              Loading coupons...
            </p>

          </div>
        ) : coupons.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">

            <Tag
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-bold text-slate-900">
              No coupons found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first discount coupon.
            </p>

          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            {coupons.map((coupon) => {

              const expired = isExpired(
                coupon.expiryDate
              );

              const usageFull =
                coupon.usageLimit > 0 &&
                coupon.usedCount >=
                  coupon.usageLimit;

              return (
                <div
                  key={coupon._id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Tag size={21} />
                      </div>

                      <div>
                        <h3 className="font-black tracking-wide text-slate-900">
                          {coupon.code}
                        </h3>

                        <p className="text-xs capitalize text-slate-500">
                          {coupon.discountType}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        coupon.active &&
                        !expired &&
                        !usageFull
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {expired
                        ? "Expired"
                        : usageFull
                        ? "Used Up"
                        : coupon.active
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </div>

                  {/* Discount */}
                  <div className="mt-5 rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-500">
                      Discount
                    </p>

                    <p className="mt-1 text-2xl font-black text-blue-600">
                      {coupon.discountType ===
                      "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </p>

                    {coupon.minBookingAmount >
                      0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        Min. booking ₹
                        {
                          coupon.minBookingAmount
                        }
                      </p>
                    )}

                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 text-sm">

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Max Discount
                      </span>

                      <span className="font-bold text-slate-700">
                        {coupon.maxDiscount > 0
                          ? `₹${coupon.maxDiscount}`
                          : "No limit"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Usage
                      </span>

                      <span className="font-bold text-slate-700">
                        {coupon.usedCount || 0}
                        {" / "}
                        {coupon.usageLimit > 0
                          ? coupon.usageLimit
                          : "∞"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Expires
                      </span>

                      <span className="font-bold text-slate-700">
                        {formatDate(
                          coupon.expiryDate
                        )}
                      </span>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="mt-5 grid grid-cols-3 gap-2">

                    <button
                      onClick={() =>
                        toggleStatus(
                          coupon._id
                        )
                      }
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        coupon.active
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {coupon.active
                        ? "Disable"
                        : "Enable"}
                    </button>

                    <button
                      onClick={() =>
                        openEditModal(coupon)
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-200"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCoupon(
                          coupon._id
                        )
                      }
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-200"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Coupon
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {editingCoupon
                    ? "Edit Coupon"
                    : "Create Coupon"}
                </h2>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >

              {/* Code */}
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Coupon Code
                </label>

                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="BIKE20"
                  required
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold uppercase outline-none focus:border-blue-500"
                />
              </div>

              {/* Type + Value */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Discount Type
                  </label>

                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  >
                    <option value="percentage">
                      Percentage
                    </option>

                    <option value="fixed">
                      Fixed Amount
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Discount Value
                  </label>

                  <input
                    type="number"
                    name="discountValue"
                    value={
                      form.discountValue
                    }
                    onChange={handleChange}
                    min="1"
                    required
                    placeholder={
                      form.discountType ===
                      "percentage"
                        ? "20"
                        : "500"
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  />
                </div>

              </div>

              {/* Min + Max */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Minimum Booking Amount
                  </label>

                  <input
                    type="number"
                    name="minBookingAmount"
                    value={
                      form.minBookingAmount
                    }
                    onChange={handleChange}
                    min="0"
                    placeholder="1000"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Maximum Discount
                  </label>

                  <input
                    type="number"
                    name="maxDiscount"
                    value={form.maxDiscount}
                    onChange={handleChange}
                    min="0"
                    placeholder="500"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  />
                </div>

              </div>

              {/* Expiry + Usage */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Usage Limit
                  </label>

                  <input
                    type="number"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={handleChange}
                    min="0"
                    placeholder="100"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    0 = unlimited
                  </p>
                </div>

              </div>

              {/* Active */}
              <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-50 p-4">

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4"
                />

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Active Coupon
                  </p>

                  <p className="text-xs text-slate-500">
                    Customers can use this coupon.
                  </p>
                </div>

              </label>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                {editingCoupon
                  ? "Update Coupon"
                  : "Create Coupon"}
              </button>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;