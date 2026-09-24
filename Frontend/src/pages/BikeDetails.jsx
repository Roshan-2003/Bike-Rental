import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Fuel,
  Heart,
  MapPin,
  Settings,
  ShieldCheck,
  Gauge,
} from "lucide-react";

import api from "../services/api";

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [error, setError] = useState("");

  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchBike = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/bikes/${id}`);

        setBike(response.data.bike);
      } catch (error) {
        console.error("Failed to fetch bike:", error);
        setError("Unable to load bike details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [id]);

  // Calculate rental days
  const calculateDays = () => {
    if (!startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return days > 0 ? days : 0;
  };

  const totalDays = calculateDays();

  const totalAmount =
    totalDays > 0
      ? totalDays * bike.pricePerDay
      : 0;

  const handleBooking = () => {
    setError("");

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select rental dates.");
      return;
    }

    if (totalDays <= 0) {
      setError("End date must be after start date.");
      return;
    }

    navigate("/bookings/new", {
      state: {
        bikeId: bike._id,
        bike,
        startDate,
        endDate,
        totalDays,
        totalAmount,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading bike details...
          </p>
        </div>
      </div>
    );
  }

  if (error && !bike) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Bike Not Found
          </h2>

          <p className="mt-2 text-slate-500">
            {error}
          </p>

          <button
            onClick={() => navigate("/bikes")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Browse Bikes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Back */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Bikes
        </button>
      </div>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* LEFT */}
          <div className="lg:col-span-2">

            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img
                src={bike.image}
                alt={bike.name}
                className="h-[300px] w-full object-cover sm:h-[430px]"
              />
            </div>

            {/* Bike Info */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">

              <div className="flex flex-col justify-between gap-4 sm:flex-row">

                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                    {bike.brand}
                  </p>

                  <h1 className="mt-1 text-3xl font-black text-slate-900">
                    {bike.name}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    {bike.location}
                  </div>
                </div>

                <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500">
                  <Heart size={19} />
                </button>

              </div>

              {/* Features */}
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

                <InfoBox
                  icon={<Settings size={18} />}
                  label="Transmission"
                  value={bike.transmission}
                />

                <InfoBox
                  icon={<Fuel size={18} />}
                  label="Fuel"
                  value={bike.fuelType}
                />

                <InfoBox
                  icon={<Gauge size={18} />}
                  label="Engine"
                  value={`${bike.engineCC} CC`}
                />

                <InfoBox
                  icon={<ShieldCheck size={18} />}
                  label="Status"
                  value={bike.available ? "Available" : "Unavailable"}
                />

              </div>

              {/* Description */}
              <div className="mt-8 border-t border-slate-100 pt-6">

                <h2 className="text-lg font-bold text-slate-900">
                  About This Bike
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {bike.description ||
                    "Enjoy a comfortable and reliable ride with this bike. Perfect for city travel, weekend trips and everyday journeys."}
                </p>

              </div>

            </div>
          </div>

          {/* RIGHT BOOKING CARD */}
          <div>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              {/* Price */}
              <div className="flex items-end justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Rental price
                  </p>

                  <p className="mt-1 text-3xl font-black text-slate-900">
                    ₹{bike.pricePerDay}
                    <span className="ml-1 text-sm font-medium text-slate-400">
                      / day
                    </span>
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    bike.available
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {bike.available
                    ? "Available"
                    : "Unavailable"}
                </span>

              </div>

              {/* Dates */}
              <div className="mt-6 space-y-4">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Start Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={startDate}
                      min={minimumDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    End Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={endDate}
                      min={startDate || minimumDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

              </div>

              {/* Error */}
              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Summary */}
              {totalDays > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      ₹{bike.pricePerDay} × {totalDays} days
                    </span>

                    <span className="font-semibold text-slate-900">
                      ₹{totalAmount}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between border-t border-slate-100 pt-3">
                    <span className="font-bold text-slate-900">
                      Total
                    </span>

                    <span className="text-xl font-black text-blue-600">
                      ₹{totalAmount}
                    </span>
                  </div>

                </div>
              )}

              {/* Book */}
              <button
                onClick={handleBooking}
                disabled={!bike.available}
                className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {bike.available
                  ? "Continue Booking"
                  : "Bike Unavailable"}
              </button>

              <p className="mt-3 text-center text-xs text-slate-400">
                Secure booking • No hidden charges
              </p>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

const InfoBox = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="text-blue-600">
        {icon}
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-slate-800">
        {value || "N/A"}
      </p>

    </div>
  );
};

export default BikeDetails;