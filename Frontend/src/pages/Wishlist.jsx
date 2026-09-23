import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Trash2,
} from "lucide-react";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";

const Wishlist = () => {
  const [wishlist, setWishlist] =
    useState([]);

  const loadWishlist =
    async () => {
      try {
        const data =
          await getWishlist();

        setWishlist(
          data.wishlist || []
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    loadWishlist();
  }, []);

  const remove = async (
    bikeId
  ) => {
    try {
      await removeFromWishlist(
        bikeId
      );

      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.bike?._id !==
            bikeId
        )
      );
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Unable to remove"
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {wishlist.map(
            (item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-xl bg-white shadow"
              >
                <img
                  src={
                    item.bike?.image
                  }
                  alt={
                    item.bike?.name
                  }
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="font-bold">
                    {
                      item.bike
                        ?.name
                    }
                  </h2>

                  <p className="mt-1 text-blue-600">
                    ₹
                    {
                      item.bike
                        ?.pricePerDay
                    }
                    /day
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/bikes/${item.bike?._id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-white"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        remove(
                          item.bike?._id
                        )
                      }
                      className="rounded-lg border border-red-200 px-4 text-red-600"
                    >
                      <Trash2
                        size={18}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Wishlist;