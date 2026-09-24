import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bike,
  Heart,
  MapPin,
  Fuel,
  ArrowRight,
  Trash2,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import api from "../services/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");

      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error("Wishlist error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load wishlist."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (bikeId) => {
    try {
      setRemovingId(bikeId);

      await api.delete(`/wishlist/${bikeId}`);

      setWishlist((prev) =>
        prev.filter((item) => {
          const bike =
            typeof item.bike === "object"
              ? item.bike
              : item;

          return bike?._id !== bikeId;
        })
      );
    } catch (error) {
      console.error("Remove wishlist error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to remove bike from wishlist."
      );
    } finally {
      setRemovingId(null);
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
          <span>Loading wishlist...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Heart
                  size={23}
                  fill="currentColor"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  MY COLLECTION
                </p>

                <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                  My Wishlist
                </h1>
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Save your favourite bikes and rent them whenever
              you're ready.
            </p>
          </div>

          <Link
            to="/bikes"
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Browse Bikes
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>

            <button
              onClick={fetchWishlist}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-red-600 shadow-sm"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* Count */}
        {wishlist.length > 0 && (
          <div className="mt-8 mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-600">
              {wishlist.length}{" "}
              {wishlist.length === 1 ? "bike" : "bikes"} saved
            </p>
          </div>
        )}

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Heart
                size={36}
                fill="currentColor"
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-slate-900">
              Your Wishlist Is Empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              You haven't saved any bikes yet. Browse our
              collection and add your favourite bikes here.
            </p>

            <Link
              to="/bikes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Explore Bikes
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => {
              const bike =
                typeof item.bike === "object"
                  ? item.bike
                  : item;

              if (!bike?._id) return null;

              return (
                <WishlistCard
                  key={bike._id}
                  bike={bike}
                  removing={
                    removingId === bike._id
                  }
                  onRemove={removeFromWishlist}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

/* ---------------- Wishlist Card ---------------- */

const WishlistCard = ({
  bike,
  removing,
  onRemove,
}) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">

        {bike.image ? (
          <img
            src={bike.image}
            alt={bike.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Bike size={50} />
          </div>
        )}

        {/* Availability */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              bike.available
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-white"
            }`}
          >
            {bike.available
              ? "Available"
              : "Unavailable"}
          </span>
        </div>

        {/* Remove */}
        <button
          onClick={() => onRemove(bike._id)}
          disabled={removing}
          title="Remove from wishlist"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-md backdrop-blur transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {removing ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={18} />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-5">

        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
          {bike.brand || "RideX"}
        </p>

        <h2 className="mt-1 truncate text-lg font-black text-slate-900">
          {bike.name}
        </h2>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <MapPin
            size={16}
            className="shrink-0 text-blue-600"
          />

          <span className="truncate">
            {bike.location || "Location unavailable"}
          </span>
        </div>

        {/* Fuel */}
        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <Fuel
            size={16}
            className="shrink-0 text-blue-600"
          />

          <span>
            {bike.fuelType || "Petrol"}
          </span>
        </div>

        {/* Bottom */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          <div>
            <p className="text-xs text-slate-400">
              Starting from
            </p>

            <p className="mt-0.5 text-lg font-black text-slate-900">
              ₹
              {bike.pricePerDay?.toLocaleString(
                "en-IN"
              )}
              <span className="text-xs font-medium text-slate-400">
                /day
              </span>
            </p>
          </div>

          <Link
            to={`/bikes/${bike._id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700"
          >
            View
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default Wishlist;