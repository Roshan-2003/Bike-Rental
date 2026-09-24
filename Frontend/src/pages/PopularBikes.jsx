import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

function PopularBikes() {
  return (
    <div>
      <section
        id="bikes"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Choose Your Perfect Ride"
            description="From city commuters to powerful machines, find a bike that matches your journey."
          />

          <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            <BikePreview
              image="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"
              name="Urban Cruiser"
              type="Cruiser"
              price="₹899"
              rating="4.9"
            />

            <BikePreview
              image="https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&w=900&q=80"
              name="Street Rider"
              type="Sports"
              price="₹1,199"
              rating="4.8"
            />

            <BikePreview
              image="https://images.unsplash.com/photo-1525160354320-d8e92641c563?auto=format&fit=crop&w=900&q=80"
              name="City Explorer"
              type="Commuter"
              price="₹699"
              rating="4.9"
            />
          </div>

          <div className="mt-8 text-center sm:mt-10">
            <Link
              to="/bikes"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-blue-600 hover:text-blue-600 sm:px-6 sm:py-3 sm:text-base"
            >
              View All Bikes
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

const SectionHeader = ({ title, description, dark = false }) => (
  <div
    className={`mx-auto max-w-2xl text-center ${
      dark ? "text-white" : "text-slate-900"
    }`}
  >
    <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">
      {title}
    </h2>

    <p
      className={`mt-3 text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7 ${
        dark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {description}
    </p>
  </div>
);

const BikePreview = ({ image, name, type, price, rating }) => (
  <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="relative overflow-hidden">
      <img
        src={image}
        alt={name}
        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56 lg:h-64"
      />

      <div className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold sm:left-4 sm:top-4 sm:px-3">
        {type}
      </div>

      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold sm:right-4 sm:top-4 sm:px-3">
        <Star size={13} className="fill-yellow-400 text-yellow-400" />

        {rating}
      </div>
    </div>

    <div className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h3 className="mt-5 text-lg font-bold text-slate-900 sm:mt-6 sm:text-xl">
          {name}
        </h3>

        <p className="font-black text-blue-600">
          {price}
          <span className="text-xs font-medium text-slate-400">/day</span>
        </p>
      </div>

      <Link
        to="/bikes"
        className="mt-4 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition bg-blue-600 sm:mt-5 sm:py-3 sm:text-base"
      >
        View Bike
        <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);

export default PopularBikes;
