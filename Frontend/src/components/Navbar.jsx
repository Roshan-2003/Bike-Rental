import { useState } from "react";
import {
  Bike,
  CalendarDays,
  Heart,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPanel = location.pathname.startsWith("/admin");
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
  }

  const closeMenu = () => setIsOpen(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
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

        <nav className="hidden items-center gap-6 lg:flex">
          {isAdminPanel ? <AdminNavLinks /> : <PublicNavLinks />}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAdminPanel ? (
            token && <LogoutButton onLogout={handleLogout} />
          ) : token ? (
            <>
              <Link to="/wishlist" aria-label="Wishlist" className="rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-red-500">
                <Heart size={19} />
              </Link>
              <Link to="/bookings" aria-label="Bookings" className="rounded-lg p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-blue-600">
                <CalendarDays size={19} />
              </Link>
              <Link to="/profile" className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">
                <User size={17} />
                <span>{user?.name || "Profile"}</span>
              </Link>
              <LogoutButton onLogout={handleLogout} />
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Get Started</Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className="rounded-lg p-2 lg:hidden"
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 lg:hidden">
          <nav className="space-y-1">
            {isAdminPanel ? <AdminMobileLinks onClick={closeMenu} /> : <PublicMobileLinks onClick={closeMenu} />}
            <div className="border-t pt-4">
              {isAdminPanel || token ? (
                <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left font-semibold text-red-600">
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/login" onClick={closeMenu} className="rounded-lg border px-4 py-3 text-center font-semibold">Login</Link>
                  <Link to="/register" onClick={closeMenu} className="rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white">Register</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const MobileLink = ({ to, text, onClick }) => (
  <Link to={to} onClick={onClick} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
    {text}
  </Link>
);

const NavLink = ({ to, text }) => (
  <Link to={to} className="text-sm font-semibold text-slate-600 transition hover:text-blue-600">
    {text}
  </Link>
);

const AnchorLink = ({ href, text }) => (
  <a href={href} className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
    {text}
  </a>
);

const AnchorMobileLink = ({ href, text, onClick }) => (
  <a href={href} onClick={onClick} className="block rounded-lg px-3 py-3 font-medium text-slate-700 hover:bg-slate-50">
    {text}
  </a>
);

const AdminNavLinks = () => (
  <>
    <NavLink to="/admin" text="Dashboard" />
    <NavLink to="/admin/bikes" text="Manage Bikes" />
    <NavLink to="/admin/bookings" text="Bookings" />
    <NavLink to="/admin/users" text="Users" />
    <NavLink to="/admin/coupons" text="Coupons" />
    <NavLink to="/admin/reports" text="Reports" />
  </>
);

const PublicNavLinks = () => (
  <>
    <NavLink to="/" text="Home" />
    <AnchorLink href="#bikes" text="Bikes" />
    <AnchorLink href="#features" text="Why Us" />
    <AnchorLink href="#how-it-works" text="How It Works" />
    <AnchorLink href="#reviews" text="Reviews" />
    <AnchorLink href="#contact" text="Contact" />
  </>
);

const AdminMobileLinks = ({ onClick }) => (
  <>
    <MobileLink to="/admin" text="Dashboard" onClick={onClick} />
    <MobileLink to="/admin/bikes" text="Manage Bikes" onClick={onClick} />
    <MobileLink to="/admin/bookings" text="Bookings" onClick={onClick} />
    <MobileLink to="/admin/users" text="Users" onClick={onClick} />
    <MobileLink to="/admin/coupons" text="Coupons" onClick={onClick} />
    <MobileLink to="/admin/reports" text="Reports" onClick={onClick} />
  </>
);

const PublicMobileLinks = ({ onClick }) => (
  <>
    <MobileLink to="/" text="Home" onClick={onClick} />
    <AnchorMobileLink href="#bikes" text="Bikes" onClick={onClick} />
    <AnchorMobileLink href="#features" text="Why Us" onClick={onClick} />
    <AnchorMobileLink href="#how-it-works" text="How It Works" onClick={onClick} />
    <AnchorMobileLink href="#reviews" text="Reviews" onClick={onClick} />
    <AnchorMobileLink href="#contact" text="Contact" onClick={onClick} />
  </>
);

const LogoutButton = ({ onLogout }) => (
  <button type="button" onClick={onLogout} aria-label="Logout" className="rounded-lg p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600">
    <LogOut size={18} />
  </button>
);

export default Navbar;
