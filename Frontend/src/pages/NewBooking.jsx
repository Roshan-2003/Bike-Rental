import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Bike as BikeIcon,
  MapPin,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { createBooking } from "../services/booking.service";

const NewBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bike = state?.bike;
  const totalDays = Number(state?.totalDays || 0);
  const totalAmount = Number(state?.totalAmount || 0);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await createBooking({
        bikeId: state.bikeId,
        startDate: state.startDate,
        endDate: state.endDate,
        paymentMethod,
        couponCode: couponCode.trim() || undefined,
      });

      const booking = response.booking;

      if (paymentMethod === "ONLINE") {
        navigate(`/payment/${booking._id}`, {
          state: { booking },
        });
      } else {
        navigate(`/bookings/${booking._id}`, {
          state: { bookingCreated: true },
        });
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to create your booking. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!bike || !state?.bikeId || !state?.startDate || !state?.endDate) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black text-slate-900">
            Booking details are missing
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Select a bike and rental dates before continuing.
          </p>
          <button
            onClick={() => navigate("/bikes")}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            Browse Bikes
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to bike
        </button>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="h-64 bg-slate-100 sm:h-80">
                {bike.image ? (
                  <img
                    src={bike.image}
                    alt={bike.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <BikeIcon size={48} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {bike.brand}
                </p>
                <h1 className="mt-1 text-2xl font-black text-slate-900">
                  {bike.name}
                </h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin size={16} />
                  {bike.location}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-black text-slate-900">
                Rental summary
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <SummaryItem
                  icon={<CalendarDays size={17} />}
                  label="Pickup"
                  value={formatDate(state.startDate)}
                />
                <SummaryItem
                  icon={<CalendarDays size={17} />}
                  label="Return"
                  value={formatDate(state.endDate)}
                />
                <SummaryItem
                  icon={<CheckCircle2 size={17} />}
                  label="Duration"
                  value={`${totalDays} ${totalDays === 1 ? "day" : "days"}`}
                />
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CreditCard size={21} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Confirm booking
                </h2>
                <p className="text-sm text-slate-500">
                  Secure checkout for your ride
                </p>
              </div>
            </div>

            <div className="mt-6 border-y border-slate-100 py-5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>
                  ₹{bike.pricePerDay} × {totalDays} days
                </span>
                <span className="font-semibold text-slate-900">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-4 flex justify-between">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-blue-600">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <label className="mt-6 block text-sm font-bold text-slate-700">
              Coupon code <span className="font-normal text-slate-400">(optional)</span>
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder="WELCOME10"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </label>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold text-slate-700">
                Payment method
              </legend>
              <div className="mt-3 space-y-3">
                <PaymentOption
                  value="ONLINE"
                  selected={paymentMethod === "ONLINE"}
                  onChange={setPaymentMethod}
                  icon={<CreditCard size={19} />}
                  title="Pay online"
                  description="Secure Razorpay checkout"
                />
                <PaymentOption
                  value="COD"
                  selected={paymentMethod === "COD"}
                  onChange={setPaymentMethod}
                  icon={<Wallet size={19} />}
                  title="Pay at pickup"
                  description="Pay when you collect the bike"
                />
              </div>
            </fieldset>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating booking..." : paymentMethod === "ONLINE" ? "Continue to payment" : "Confirm booking"}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={14} />
              Your booking details are protected
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

const SummaryItem = ({ icon, label, value }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <div className="flex items-center gap-2 text-blue-600">
      {icon}
      <span className="text-xs font-semibold text-slate-500">{label}</span>
    </div>
    <p className="mt-2 text-sm font-bold text-slate-900">{value}</p>
  </div>
);

const PaymentOption = ({ value, selected, onChange, icon, title, description }) => (
  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${selected ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-200"}`}>
    <input
      type="radio"
      name="paymentMethod"
      value={value}
      checked={selected}
      onChange={(event) => onChange(event.target.value)}
      className="h-4 w-4 accent-blue-600"
    />
    <span className={selected ? "text-blue-600" : "text-slate-500"}>{icon}</span>
    <span>
      <span className="block text-sm font-bold text-slate-900">{title}</span>
      <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
    </span>
  </label>
);

export default NewBooking;