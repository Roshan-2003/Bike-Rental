import {
  ArrowRight,
  Bike,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Compass,
  Headphones,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBikes } from "../services/bike.service";

const Home = () => {
  const navigate = useNavigate();
  const [bikes, setBikes] = useState([]);
  const [bikesLoading, setBikesLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await getBikes();
        setBikes(
          (response.bikes || []).filter((bike) => bike.available).slice(0, 3),
        );
      } catch (error) {
        console.error("Failed to load bikes for home page:", error);
      } finally {
        setBikesLoading(false);
      }
    };

    fetchBikes();
  }, []);

  const handleSearch = () => {
    navigate("/bikes");
  };

  return (
    <div className="overflow-hidden">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative min-h-[600px] overflow-hidden bg-slate-950 sm:min-h-[640px] lg:min-h-[680px]">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl items-center px-4 py-14 sm:min-h-[640px] sm:px-6 sm:py-16 lg:min-h-[680px] lg:px-8 lg:py-20">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Hero Content */}
            <div className="max-w-2xl text-white">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur sm:mb-6 sm:px-4 sm:py-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />

                <span className="text-xs font-medium text-slate-200 sm:text-sm">
                  Bikes available for rent today
                </span>
              </div>

              <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl xl:text-7xl">
                Your Ride.
                <br />
                <span className="text-blue-400">Your Journey.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:mt-7 sm:text-lg sm:leading-8">
                Discover reliable bikes, flexible rental plans and a seamless
                booking experience. Pick your bike and start your journey today.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
                <Link
                  to="/bikes"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 transition hover:bg-blue-500 sm:px-7 sm:py-4 sm:text-base"
                >
                  Explore Bikes
                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15 sm:px-7 sm:py-4 sm:text-base"
                >
                  How It Works
                </a>
              </div>

              {/* Trust */}
              <div className="mt-8 flex flex-wrap gap-4 text-xs text-slate-300 sm:mt-10 sm:gap-6 sm:text-sm">
                <TrustItem text="Verified Bikes" />

                <TrustItem text="Secure Payments" />

                <TrustItem text="24/7 Support" />
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:justify-self-end">
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-xl sm:rounded-3xl sm:p-6 md:p-8">
                <div className="mb-5 sm:mb-7">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600 sm:text-sm">
                    Start Your Ride
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
                    Find your perfect bike
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Search, choose your dates and book in minutes.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2">
                      Pickup Location
                    </label>

                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-3.5 top-3.5 text-slate-400 sm:left-4"
                      />

                      <input
                        placeholder="Enter city or location"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:py-3.5 sm:pl-11 sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2">
                        Pick-up
                      </label>

                      <input
                        type="date"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700 sm:mb-2">
                        Return
                      </label>

                      <input
                        type="date"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:py-4 sm:text-base"
                  >
                    <Search size={18} />
                    Search Available Bikes
                  </button>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400 sm:mt-6">
                  <ShieldCheck size={14} />
                  Secure & trusted booking
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="relative z-10 -mt-6 px-4 sm:-mt-10">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl grid-cols-2 lg:grid-cols-4">
          <Stat value="500+" label="Premium Bikes" />

          <Stat value="10K+" label="Happy Riders" />

          <Stat value="25+" label="Pickup Locations" />

          <Stat value="4.9/5" label="Customer Rating" />
        </div>
      </section>

      {/* =====================================================
          POPULAR BIKES
      ===================================================== */}

      <section
        id="bikes"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            // eyebrow="OUR FLEET"
            title="Choose Your Perfect Ride"
            description="From city commuters to powerful machines, find a bike that matches your journey."
          />

          <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {bikesLoading ? (
              <p className="text-center text-slate-500 md:col-span-2 lg:col-span-3">
                Loading bikes...
              </p>
            ) : bikes.length ? (
              bikes.map((bike) => (
                <BikePreview
                  key={bike._id}
                  id={bike._id}
                  image={bike.image}
                  name={bike.name}
                  type={bike.type}
                  price={bike.pricePerDay}
                />
              ))
            ) : (
              <p className="text-center text-slate-500 md:col-span-2 lg:col-span-3">
                No bikes are currently available.
              </p>
            )}
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

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        id="features"
        className="bg-white px-4 py-16 text-slate-900 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            // eyebrow="WHY RIDEX"
            title="Everything You Need For A Better Ride"
            description="We've designed every part of the rental experience around convenience, safety and freedom."
          />

          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheck />}
              title="Verified & Safe Bikes"
              text="Every bike is inspected and maintained regularly so you can ride with confidence."
            />

            <FeatureCard
              icon={<Zap />}
              title="Instant Booking"
              text="Choose your bike, select your dates and confirm your rental without unnecessary paperwork."
            />

            <FeatureCard
              icon={<Clock3 />}
              title="Flexible Rentals"
              text="Rent for a day, weekend or longer. Choose a rental duration that works for you."
            />

            <FeatureCard
              icon={<MapPin />}
              title="Convenient Locations"
              text="Find pickup and drop-off locations that are convenient for your journey."
            />

            <FeatureCard
              icon={<Headphones />}
              title="24/7 Support"
              text="Our support team is available whenever you need help during your rental."
            />

            <FeatureCard
              icon={<ShieldCheck />}
              title="Secure Payments"
              text="Pay online through secure payment processing and receive instant confirmation."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            // eyebrow="SIMPLE PROCESS"
            title="Rent A Bike In 3 Easy Steps"
            description="No complicated process. Just choose, book and ride."
          />

          <div className="relative mt-12 grid gap-8 sm:mt-14 sm:gap-10 md:grid-cols-3 lg:mt-16">
            <Step
              number="01"
              icon={<Compass />}
              title="Choose Your Bike"
              text="Browse our collection and select a bike that fits your style and requirements."
            />

            <Step
              number="02"
              icon={<CalendarCheck />}
              title="Select Your Dates"
              text="Choose your pickup and return dates and check the rental price instantly."
            />

            <Step
              number="03"
              icon={<Bike />}
              title="Ride & Enjoy"
              text="Complete your booking, pick up your bike and start your adventure."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            // eyebrow="EXPLORE"
            title="Ride Your Way"
            description="Whatever your plan, we have a bike for it."
          />

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:mt-14 lg:grid-cols-4">
            <Category
              title="City Rides"
              text="Easy & comfortable"
              image="https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=700&q=80"
            />

            <Category
              title="Adventure"
              text="Built for exploration"
              image="https://images.unsplash.com/photo-1558980394-0c9493b5e8b5?auto=format&fit=crop&w=700&q=80"
            />

            <Category
              title="Sports"
              text="Power & performance"
              image="https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80"
            />

            <Category
              title="Long Trips"
              text="Comfortable journeys"
              image="https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=700&q=80"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <section
        id="reviews"
        className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            // eyebrow="RIDER STORIES"
            title="What Our Riders Say"
            description="Real experiences from people who chose RideX for their journey."
          />

          <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-3 lg:mt-14">
            <Review
              name="Rahul Mehta"
              location="Ahmedabad"
              text="The booking process was extremely simple. I booked a bike for a weekend trip and everything went smoothly."
            />

            <Review
              name="Priya Shah"
              location="Vadodara"
              text="Loved the experience. The bike was clean, well maintained and exactly as shown on the website."
            />

            <Review
              name="Arjun Patel"
              location="Surat"
              text="Very convenient rental service. The online payment and booking confirmation made everything easy."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl bg-blue-600 px-5 py-8 text-center text-white sm:rounded-3xl sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200 sm:text-sm">
              YOUR NEXT ADVENTURE
            </p>

            <h2 className="mt-3 text-2xl font-black sm:mt-4 sm:text-3xl lg:text-4xl">
              Ready To Hit The Road?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm text-blue-100 sm:mt-5 sm:text-base">
              Find your perfect bike and start your next journey today.
            </p>

            <Link
              to="/bikes"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-50 sm:mt-8 sm:px-7 sm:py-4 sm:text-base"
            >
              Find Your Bike
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        id="contact"
        className="bg-white px-4 py-16 text-slate-900 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 sm:text-sm">
              GET IN TOUCH
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:mt-4 sm:text-4xl">
              Have Questions?
              <br />
              We're Here To Help.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:mt-6 sm:text-base">
              Need help choosing a bike or have questions about your booking?
              Send us a message and our team will get back to you.
            </p>

            <div className="mt-8 space-y-4 sm:mt-10 sm:space-y-5">
              <ContactItem
                icon={<MapPin />}
                title="Our Location"
                text="Ahmedabad, Gujarat, India"
              />

              <ContactItem
                icon={<Headphones />}
                title="Customer Support"
                text="+91 98765 43210"
              />

              <ContactItem
                icon={<Clock3 />}
                title="Working Hours"
                text="Monday - Sunday, 24/7"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-lg sm:rounded-3xl sm:p-6 md:p-8">
            <h3 className="text-xl font-semibold sm:text-2xl">
              Send Us A Message
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              We usually respond within 24 hours.
            </p>

            <form
              className="mt-6 space-y-3 sm:mt-7 sm:space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thanks! Your message has been submitted.");
              }}
            >
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                <input
                  required
                  placeholder="Your Name"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
                />
              </div>

              <input
                placeholder="Phone Number"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
              />

              <input
                placeholder="Subject"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
              />

              <textarea
                required
                rows="5"
                placeholder="How can we help you?"
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 sm:py-3 sm:text-base"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 sm:py-4 sm:text-base"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   COMPONENTS
========================================================= */

const TrustItem = ({ text }) => (
  <div className="flex items-center gap-2">
    <CheckCircle2 size={16} className="text-green-400" />

    <span>{text}</span>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="border-b border-r border-slate-100 p-4 text-center last:border-r-0 sm:p-6 lg:border-b-0 lg:p-7 lg:[&:nth-child(2)]:border-r">
    <p className="text-xl font-black text-slate-900 sm:text-2xl lg:text-3xl">
      {value}
    </p>

    <p className="mt-1 text-xs text-slate-500 sm:text-sm">{label}</p>
  </div>
);

const SectionHeader = ({ eyebrow, title, description, dark = false }) => (
  <div
    className={`mx-auto max-w-2xl text-center ${
      dark ? "text-white" : "text-slate-900"
    }`}
  >
    {eyebrow && (
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 sm:text-sm">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-3 text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>

    <p
      className={`mt-3 text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7 ${
        dark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {description}
    </p>
  </div>
);

const BikePreview = ({ id, image, name, type, price }) => (
  <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="relative overflow-hidden">
      <img
        src={
          image ||
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80"
        }
        alt={name}
        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56 lg:h-64"
      />

      <div className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-bold sm:left-4 sm:top-4 sm:px-3">
        {type}
      </div>
    </div>

    <div className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        {/* <h3 className="text-lg font-semibold sm:text-xl">
          {name}
        </h3> */}

        <h3 className="mt-5 text-lg font-bold text-slate-900 sm:mt-6 sm:text-xl">
          {name}{" "}
        </h3>

        <p className="font-black text-blue-600">
          ₹{Number(price).toLocaleString("en-IN")}
          <span className="text-xs font-medium text-slate-400">/day</span>
        </p>
      </div>

      <Link
        to={`/bikes/${id}`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl  py-2.5 text-sm font-bold text-white transition bg-blue-600 sm:mt-5 sm:py-3 sm:text-base"
      >
        View Bike
        <ArrowRight size={16} />
      </Link>
    </div>
  </div>
);

const FeatureCard = ({ icon, title, text }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-blue-200 hover:bg-white hover:shadow-md sm:p-6 lg:p-7">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 sm:h-12 sm:w-12">
      {icon}
    </div>

    <h3 className="mt-5 text-lg font-bold text-slate-900 sm:mt-6 sm:text-xl">
      {title}
    </h3>

    <p className="mt-2.5 text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
      {text}
    </p>
  </div>
);

const Step = ({ number, icon, title, text }) => (
  <div className="relative text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 sm:h-16 sm:w-16">
      {icon}
    </div>

    <p className="mt-4 text-xs font-black tracking-widest text-blue-600 sm:mt-5">
      STEP {number}
    </p>

    <h3 className="mt-2 text-lg font-black sm:text-xl">{title}</h3>

    <p className="mx-auto mt-2.5 max-w-sm text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base sm:leading-7">
      {text}
    </p>
  </div>
);

const Category = ({ title, text, image }) => (
  <Link
    to="/bikes"
    className="group relative h-56 overflow-hidden rounded-2xl sm:h-64 lg:h-72"
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    <div className="absolute bottom-0 p-5 text-white sm:p-6">
      <h3 className="text-xl font-black sm:text-2xl">{title}</h3>

      <p className="mt-1 text-xs text-slate-200 sm:text-sm">{text}</p>
    </div>
  </Link>
);

const Review = ({ name, location, text }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className="fill-yellow-400 text-yellow-400"
        />
      ))}
    </div>

    <p className="mt-4 text-sm leading-6 text-slate-600 sm:mt-5 sm:text-base sm:leading-7">
      "{text}"
    </p>

    <div className="mt-5 flex items-center gap-3 sm:mt-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600 sm:h-11 sm:w-11">
        {name.charAt(0)}
      </div>

      <div>
        <p className="text-sm font-bold sm:text-base">{name}</p>

        <p className="text-xs text-slate-400 sm:text-sm">{location}</p>
      </div>
    </div>
  </div>
);

const ContactItem = ({ icon, title, text }) => (
  <div className="flex items-center gap-4">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 sm:h-11 sm:w-11">
      {icon}
    </div>

    <div>
      <p className="text-sm font-bold text-slate-900 sm:text-base">{title}</p>

      <p className="mt-1 text-xs text-slate-500 sm:text-sm">{text}</p>
    </div>
  </div>
);

{
  /* <Footer/> */
}

export default Home;
