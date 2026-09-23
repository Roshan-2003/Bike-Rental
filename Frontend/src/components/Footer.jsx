import {
  Bike,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div>
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Bike size={22} />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Ride<span className="text-blue-600">X</span>
              </h2>

              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                Bike Rental
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
            Making bike rentals simple, reliable and
            accessible. Find your perfect ride and
            explore more with RideX.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold text-slate-900">
            Company
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link
                to="/"
                className="transition hover:text-blue-600"
              >
                Home
              </Link>
            </li>

            <li>
              <a
                href="#features"
                className="transition hover:text-blue-600"
              >
                Why RideX
              </a>
            </li>

            <li>
              <a
                href="#reviews"
                className="transition hover:text-blue-600"
              >
                Reviews
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="transition hover:text-blue-600"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-bold text-slate-900">
            Services
          </h3>

          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link
                to="/bikes"
                className="transition hover:text-blue-600"
              >
                Browse Bikes
              </Link>
            </li>

            <li>
              <Link
                to="/bookings"
                className="transition hover:text-blue-600"
              >
                My Bookings
              </Link>
            </li>

            <li>
              <Link
                to="/wishlist"
                className="transition hover:text-blue-600"
              >
                Wishlist
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="transition hover:text-blue-600"
              >
                My Profile
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-slate-900">
            Contact Us
          </h3>

          <div className="mt-4 space-y-4 text-sm text-slate-500">

            <div className="flex gap-3">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <span>
                Ahmedabad, Gujarat,
                <br />
                India
              </span>
            </div>

            <div className="flex gap-3">
              <Phone
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <span>
                +91 98765 43210
              </span>
            </div>

            <div className="flex gap-3">
              <Mail
                size={18}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <span>
                support@ridex.com
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row lg:px-8">

          <p>
            © {new Date().getFullYear()} RideX.
            All rights reserved.
          </p>

          <div className="flex gap-6">
            <button className="transition hover:text-blue-600">
              Privacy Policy
            </button>

            <button className="transition hover:text-blue-600">
              Terms & Conditions
            </button>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;