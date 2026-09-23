import {
  MapPin,
  Heart,
} from "lucide-react";

import { Link } from "react-router-dom";

const BikeCard = ({
  bike,
  onWishlist,
}) => {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img
          src={
            bike.image ||
            "https://images.unsplash.com/photo-1558981806-ec527fa84c39"
          }
          alt={bike.name}
          className="h-56 w-full object-cover"
        />

        <button
          onClick={() =>
            onWishlist?.(bike._id)
          }
          className="absolute right-3 top-3 rounded-full bg-white p-2"
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {bike.name}
            </h3>

            <p className="text-sm text-slate-500">
              {bike.brand} • {bike.type}
            </p>
          </div>

          <p className="font-bold text-blue-600">
            ₹{bike.pricePerDay}/day
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={16} />
          {bike.location}
        </div>

        <Link
          to={`/bikes/${bike._id}`}
          className="mt-5 block rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BikeCard;