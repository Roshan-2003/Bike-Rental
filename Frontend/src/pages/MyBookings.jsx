import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getMyBookings,
} from "../services/booking.service";

const MyBookings = () => {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadBookings =
      async () => {
        try {
          const data =
            await getMyBookings();

          setBookings(
            data.bookings || []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        My Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center">
          <p className="text-slate-500">
            You don't have any bookings yet.
          </p>

          <Link
            to="/bikes"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Browse Bikes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(
            (booking) => (
              <div
                key={
                  booking._id
                }
                className="grid gap-5 rounded-xl bg-white p-5 shadow-sm md:grid-cols-[180px_1fr_auto]"
              >
                <img
                  src={
                    booking.bike
                      ?.image
                  }
                  alt={
                    booking.bike
                      ?.name
                  }
                  className="h-32 w-full rounded-lg object-cover"
                />

                <div>
                  <h2 className="text-xl font-bold">
                    {
                      booking.bike
                        ?.name
                    }
                  </h2>

                  <p className="text-sm text-slate-500">
                    {
                      booking.bike
                        ?.brand
                    }
                  </p>

                  <p className="mt-3 text-sm">
                    {new Date(
                      booking.startDate
                    ).toLocaleDateString()}
                    {" → "}
                    {new Date(
                      booking.endDate
                    ).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm capitalize text-blue-600">
                      {
                        booking.status
                      }
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm capitalize">
                      {
                        booking.paymentStatus
                      }
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between md:items-end">
                  <p className="text-xl font-bold text-blue-600">
                    ₹
                    {
                      booking.totalAmount
                    }
                  </p>

                  <Link
                    to={`/bookings/${booking._id}`}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-center text-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;