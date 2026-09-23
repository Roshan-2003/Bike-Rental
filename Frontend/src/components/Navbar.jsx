import { useState } from "react";
import {
  Bike,
  Menu,
  X,
  User,
  Heart,
  CalendarDays,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Bike size={23} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              Ride<span className="text-blue-600">X</span>
            </h1>

            <p className="-mt-1 text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Bike Rental
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-900 transition hover:text-blue-600"
          >
            Home
          </Link>

          <a
            href="#bikes"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Bikes
          </a>

          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Why Us
          </a>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            How It Works
          </a>

          <a
            href="#reviews"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Reviews
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {token ? (
            <>
              <Link
                to="/wishlist"
                className="rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-red-500"
              >
                <Heart size={19} />
              </Link>

              <Link
                to="/bookings"
                className="rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
              >
                <CalendarDays size={19} />
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
              >
                <User size={17} />

                <span>
                  {user?.name || "Profile"}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() =>
            setIsOpen(!isOpen)
          }
          className="rounded-lg p-2 lg:hidden"
        >
          {isOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 lg:hidden">
          <nav className="space-y-1">
            <MobileLink
              to="/"
              text="Home"
              onClick={closeMenu}
            />

            <a
              href="#bikes"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Bikes
            </a>

            <a
              href="#features"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Why Us
            </a>

            <a
              href="#how-it-works"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>

            <a
              href="#reviews"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Reviews
            </a>

            <a
              href="#contact"
              onClick={closeMenu}
              className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact
            </a>

            <div className="border-t pt-4">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left font-semibold text-red-600"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg border px-4 py-3 text-center font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const MobileLink = ({
  to,
  text,
  onClick,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50"
  >
    {text}
  </Link>
);

export default Navbar;