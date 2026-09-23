import React from 'react'

function PopularBikes() {
  return (
    <div>
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
  )
}

export default PopularBikes
