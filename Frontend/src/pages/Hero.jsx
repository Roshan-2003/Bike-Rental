import React from "react";

function Hero() {
  return (
    <div className="overflow-hidden">
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

              <h1 className="text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl xl:text-7xl">
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

                  <h2 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">
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

      <section className="relative z-10 -mt-6 px-4 sm:-mt-10">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl grid-cols-2 lg:grid-cols-4">
          <Stat value="500+" label="Premium Bikes" />

          <Stat value="10K+" label="Happy Riders" />

          <Stat value="25+" label="Pickup Locations" />

          <Stat value="4.9/5" label="Customer Rating" />
        </div>
      </section>
    </div>
  );
}

export default Hero;
