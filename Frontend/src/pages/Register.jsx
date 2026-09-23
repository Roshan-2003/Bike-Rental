import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  registerUser,
} from "../services/auth.service";

const Register = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      phone: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        setError("");

        const data =
          await registerUser(form);

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/bikes");
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            "Registration failed"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value,
              })
            }
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone:
                  e.target.value,
              })
            }
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            minLength={6}
            required
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value,
              })
            }
            className="w-full rounded-lg border px-4 py-3"
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white"
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;