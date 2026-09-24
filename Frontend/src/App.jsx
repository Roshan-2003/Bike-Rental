import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCoupons from "./pages/admin/AdminCoupons";
import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import NewBooking from "./pages/NewBooking";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBikes from "./pages/admin/AdminBikes";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminBookingDetails from "./pages/admin/AdminBookingDetails";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="min-h-screen">
        <Routes>
          {/* Public */}

          <Route path="/" element={<Home />} />

          <Route path="/bikes" element={<Bikes />} />

          <Route path="/bikes/:id" element={<BikeDetails />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Protected */}

          <Route element={<ProtectedRoute />}>
            <Route path="/bookings/new" element={<NewBooking />} />

            <Route path="/bookings" element={<MyBookings />} />

            <Route path="/payment/:id" element={<Payment />} />

            <Route path="/bookings/:id" element={<BookingDetails />} />

            <Route path="/wishlist" element={<Wishlist />} />

            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin */}

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />

            <Route path="/admin/bikes" element={<AdminBikes />} />

            <Route path="/admin/bookings/:id" element={<AdminBookingDetails />} />

            <Route path="/admin/bookings" element={<AdminBookings />} />

            <Route path="/admin/users" element={<AdminUsers />} />

            <Route path="/admin/coupons" element={<AdminCoupons />} />

            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* 404 */}

          <Route
            path="*"
            element={
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-black">404</h1>

                  <p className="mt-3 text-slate-500">Page not found</p>
                </div>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
