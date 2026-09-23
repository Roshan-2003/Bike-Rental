import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Bikes from "./pages/Bikes";
import BikeDetails from "./pages/BikeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <main className="min-h-screen">
        <Routes>

          {/* Public */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/bikes"
            element={<Bikes />}
          />

          <Route
            path="/bikes/:id"
            element={<BikeDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected */}

          <Route
            element={
              <ProtectedRoute />
            }
          >
            <Route
              path="/bookings"
              element={
                <MyBookings />
              }
            />

            <Route
              path="/bookings/:id"
              element={
                <BookingDetails />
              }
            />

            <Route
              path="/wishlist"
              element={
                <Wishlist />
              }
            />

            <Route
              path="/profile"
              element={
                <Profile />
              }
            />
          </Route>

          {/* 404 */}

          <Route
            path="*"
            element={
              <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-black">
                    404
                  </h1>

                  <p className="mt-3 text-slate-500">
                    Page not found
                  </p>
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