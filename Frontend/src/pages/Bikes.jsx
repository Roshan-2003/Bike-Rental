import { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Fuel,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../services/api";

const Bikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("");

  const fetchBikes = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search) {
        params.search = search;
      }

      if (type) {
        params.type = type;
      }

      if (sort) {
        params.sort = sort;
      }

      const response = await api.get("/bikes", {
        params,
      });

      setBikes(response.data.bikes || []);
    } catch (error) {
      console.error("Failed to fetch bikes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, [type, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBikes();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Explore Our Collection
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900 sm:text-4xl">
            Find Your Perfect Bike
          </h1>

          <p className="mt-3 max-w-2xl text-slate-500">
            Choose from our collection of reliable bikes and
            start your journey today.
          </p>

        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-4">

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="relative md:col-span-2"
            >
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search bike or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </form>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Scooter">Scooter</option>
              <option value="Cruiser">Cruiser</option>
              <option value="Sports">Sports</option>
              <option value="Adventure">Adventure</option>
              <option value="Commuter">Commuter</option>
              <option value="Electric">Electric</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500"
            >
              <option value="">Sort By</option>
              <option value="price_asc">
                Price: Low to High
              </option>
              <option value="price_desc">
                Price: High to Low
              </option>
              <option value="newest">
                Newest
              </option>
            </select>

          </div>
        </div>

        {/* Result count */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">
            Available Bikes
          </h2>

          <span className="text-sm text-slate-500">
            {bikes.length} bikes found
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm text-slate-500">
              Loading bikes...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && bikes.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
            <h3 className="text-xl font-bold text-slate-900">
              No bikes found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Bikes */}
        {!loading && bikes.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {bikes.map((bike) => (
              <div
                key={bike._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100">

                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Wishlist */}
                  <button
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:bg-blue-600 hover:text-white"
                  >
                    <Heart size={18} />
                  </button>

                  {/* Availability */}
                  <span
                    className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
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

                {/* Content */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {bike.brand}
                      </p>

                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {bike.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">
                        ₹{bike.pricePerDay}
                      </p>

                      <p className="text-xs text-slate-400">
                        / day
                      </p>
                    </div>

                  </div>

                  {/* Details */}
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">

                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {bike.location}
                    </span>

                    <span className="flex items-center gap-1">
                      <Fuel size={14} />
                      {bike.fuelType}
                    </span>

                  </div>

                  {/* Button */}
                  <Link
                    to={`/bikes/${bike._id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>

                </div>
              </div>
            ))}

          </div>
        )}

      </section>
    </div>
  );
};

export default Bikes;