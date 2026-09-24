import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Bike as BikeIcon,
  Edit,
  Trash2,
  MapPin,
  Fuel,
  Settings2,
  Loader2,
  AlertCircle,
  RefreshCw,
  X,
  CheckCircle2,
} from "lucide-react";

import api from "../../services/api";

const bikeTypes = [
  "All",
  "Scooter",
  "Cruiser",
  "Sports",
  "Adventure",
  "Commuter",
  "Electric",
];

const AdminBikes = () => {
  const [bikes, setBikes] = useState([]);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingBike, setEditingBike] = useState(null);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/bikes?limit=100");

      setBikes(response.data.bikes || []);
    } catch (err) {
      console.error("Fetch bikes error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load bikes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);



  const handleAddBike = () => {
    setEditingBike(null);
    setShowModal(true);
  };

  const handleEditBike = (bike) => {
    setEditingBike(bike);
    setShowModal(true);
  };

  const handleDeleteBike = async (bikeId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bike?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(bikeId);
      setError("");
      setMessage("");

      await api.delete(`/bikes/${bikeId}`);

      setBikes((prev) =>
        prev.filter((bike) => bike._id !== bikeId)
      );

      setMessage("Bike deleted successfully.");
    } catch (err) {
      console.error("Delete bike error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete bike."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAvailability = async (bike) => {
    try {
      setUpdatingId(bike._id);
      setError("");

      const response = await api.put(
        `/bikes/${bike._id}`,
        {
          ...bike,
          available: !bike.available,
        }
      );

      const updatedBike = response.data.bike;

      setBikes((prev) =>
        prev.map((item) =>
          item._id === bike._id
            ? updatedBike
            : item
        )
      );
    } catch (err) {
      console.error(
        "Availability update error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update availability."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleModalSuccess = (savedBike) => {
    if (editingBike) {
      setBikes((prev) =>
        prev.map((bike) =>
          bike._id === savedBike._id
            ? savedBike
            : bike
        )
      );

      setMessage("Bike updated successfully.");
    } else {
      setBikes((prev) => [
        savedBike,
        ...prev,
      ]);

      setMessage("Bike added successfully.");
    }

    setShowModal(false);
    setEditingBike(null);
  };

  const filteredBikes = bikes.filter((bike) => {
    const searchText = search
      .toLowerCase()
      .trim();

    const matchesSearch =
      !searchText ||
      bike.name
        ?.toLowerCase()
        .includes(searchText) ||
      bike.brand
        ?.toLowerCase()
        .includes(searchText) ||
      bike.location
        ?.toLowerCase()
        .includes(searchText);

    const matchesType =
      type === "All" || bike.type === type;

    return matchesSearch && matchesType;
  });

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              ADMIN PANEL
            </p>

            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Manage Bikes
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add, edit and manage your rental bikes.
            </p>
          </div>

          <button
            onClick={handleAddBike}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add New Bike
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            <CheckCircle2 size={20} />

            <p className="text-sm font-semibold">
              {message}
            </p>

            <button
              onClick={() => setMessage("")}
              className="ml-auto"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle size={20} />

            <p className="text-sm font-semibold">
              {error}
            </p>

            <button
              onClick={fetchBikes}
              className="ml-auto inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by bike, brand or location..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Type */}
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              {bikeTypes.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item === "All"
                    ? "All Types"
                    : item}
                </option>
              ))}
            </select>

            <button
              onClick={fetchBikes}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

          </div>
        </div>

        {/* Count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">
            {filteredBikes.length} bikes found
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2
                size={24}
                className="animate-spin"
              />
              Loading bikes...
            </div>
          </div>
        ) : filteredBikes.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <BikeIcon
              size={45}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-black text-slate-900">
              No Bikes Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or add a new bike.
            </p>

            <button
              onClick={handleAddBike}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Bike
            </button>
          </div>
        ) : (
          /* Bikes */
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredBikes.map((bike) => (
              <AdminBikeCard
                key={bike._id}
                bike={bike}
                onEdit={handleEditBike}
                onDelete={handleDeleteBike}
                onToggleAvailability={
                  handleToggleAvailability
                }
                deleting={
                  deletingId === bike._id
                }
                updating={
                  updatingId === bike._id
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BikeFormModal
          bike={editingBike}
          onClose={() => {
            setShowModal(false);
            setEditingBike(null);
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </section>
  );
};

/* =====================================================
   BIKE CARD
===================================================== */

const AdminBikeCard = ({
  bike,
  onEdit,
  onDelete,
  onToggleAvailability,
  deleting,
  updating,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg">

      {/* Image */}
      <div className="relative h-48 bg-slate-100">

        {bike.image ? (
          <img
            src={bike.image}
            alt={bike.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <BikeIcon size={45} />
          </div>
        )}

        {/* Availability */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              bike.available
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {bike.available
              ? "Available"
              : "Unavailable"}
          </span>
        </div>

        {/* Featured */}
        {bike.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-900">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">

        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          {bike.brand || "RideX"}
        </p>

        <h2 className="mt-1 truncate text-lg font-black text-slate-900">
          {bike.name}
        </h2>

        <div className="mt-4 space-y-2">

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin
              size={15}
              className="text-blue-600"
            />
            <span className="truncate">
              {bike.location || "-"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Fuel
              size={15}
              className="text-blue-600"
            />
            <span>
              {bike.fuelType || "-"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Settings2
              size={15}
              className="text-blue-600"
            />
            <span>
              {bike.transmission || "-"}
              {bike.engineCC
                ? ` • ${bike.engineCC} CC`
                : ""}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs text-slate-400">
            Price per day
          </p>

          <p className="mt-1 text-xl font-black text-slate-900">
            ₹
            {Number(
              bike.pricePerDay || 0
            ).toLocaleString("en-IN")}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-4 grid grid-cols-2 gap-2">

          <button
            onClick={() => onEdit(bike)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <Edit size={15} />
            Edit
          </button>

          <button
            onClick={() => onDelete(bike._id)}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}
            Delete
          </button>

        </div>

        {/* Availability */}
        <button
          onClick={() =>
            onToggleAvailability(bike)
          }
          disabled={updating}
          className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition ${
            bike.available
              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          } disabled:opacity-50`}
        >
          {updating ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={15} />
          )}

          {bike.available
            ? "Mark Unavailable"
            : "Mark Available"}
        </button>

      </div>
    </div>
  );
};

/* =====================================================
   BIKE FORM MODAL
===================================================== */

const BikeFormModal = ({
  bike,
  onClose,
  onSuccess,
}) => {
  const isEdit = Boolean(bike);

  const [form, setForm] = useState({
    name: bike?.name || "",
    brand: bike?.brand || "",
    model: bike?.model || "",
    type: bike?.type || "Commuter",
    pricePerDay: bike?.pricePerDay || "",
    location: bike?.location || "",
    image: bike?.image || "",
    description: bike?.description || "",
    fuelType: bike?.fuelType || "Petrol",
    transmission:
      bike?.transmission || "Manual",
    engineCC: bike?.engineCC || "",
    available:
      bike?.available !== undefined
        ? bike.available
        : true,
    featured: bike?.featured || false,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(bike?.image || "");

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

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
      setSaving(true);
      setError("");

      const payload = new FormData();

      Object.entries({
        ...form,
        pricePerDay: Number(form.pricePerDay),
        engineCC: form.engineCC ? Number(form.engineCC) : 0,
      }).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      if (imageFile) {
        payload.append("imageFile", imageFile);
      }

      let response;

      if (isEdit) {
        response = await api.put(
          `/bikes/${bike._id}`,
          payload
        );
      } else {
        response = await api.post(
          "/bikes",
          payload
        );
      }

      onSuccess(response.data.bike);
    } catch (err) {
      console.error("Save bike error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save bike."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {isEdit
                ? "Edit Bike"
                : "Add New Bike"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Enter bike information below.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >

          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">

            <FormInput
              label="Bike Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Royal Enfield Classic 350"
              required
            />

            <FormInput
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Royal Enfield"
              required
            />

            <FormInput
              label="Model"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="Classic 350"
            />

            <FormSelect
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              options={[
                "Scooter",
                "Cruiser",
                "Sports",
                "Adventure",
                "Commuter",
                "Electric",
              ]}
            />

            <FormInput
              label="Price Per Day"
              name="pricePerDay"
              type="number"
              value={form.pricePerDay}
              onChange={handleChange}
              placeholder="799"
              required
            />

            <FormInput
              label="Engine CC"
              name="engineCC"
              type="number"
              value={form.engineCC}
              onChange={handleChange}
              placeholder="350"
            />

            <FormInput
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ahmedabad"
              required
            />

            <FormSelect
              label="Fuel Type"
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
              options={[
                "Petrol",
                "Electric",
              ]}
            />

            <FormSelect
              label="Transmission"
              name="transmission"
              value={form.transmission}
              onChange={handleChange}
              options={[
                "Manual",
                "Automatic",
              ]}
            />

            <FormInput
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Upload HD Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);

                  if (!file && form.image) {
                    setImagePreview(form.image);
                  }
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-blue-700"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Bike preview"
                  className="mt-3 h-32 w-full rounded-xl object-cover"
                />
              )}

              <p className="mt-2 text-xs text-slate-500">
                JPG, PNG or WebP up to 8 MB. Uploading replaces the image URL.
              </p>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the bike..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid gap-3 sm:grid-cols-2">

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="h-4 w-4 accent-blue-600"
              />

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Available
                </p>

                <p className="text-xs text-slate-500">
                  Bike can be rented
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 accent-blue-600"
              />

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Featured
                </p>

                <p className="text-xs text-slate-500">
                  Show as featured bike
                </p>
              </div>
            </label>

          </div>

          {/* Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 size={17} />
                  {isEdit
                    ? "Update Bike"
                    : "Create Bike"}
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

/* =====================================================
   FORM INPUT
===================================================== */

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
};

/* =====================================================
   FORM SELECT
===================================================== */

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AdminBikes;