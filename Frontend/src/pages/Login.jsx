import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  loginUser,
} from "../services/auth.service";

const Login = () => {
  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        setError("");

        const data =
          await loginUser(form);

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        if (
          data.user.role ===
          "admin"
        ) {
          navigate("/admin");
        } else {
          navigate("/bikes");
        }
      } catch (error) {
        setError(
          error.response?.data
            ?.message ||
            (error.code === "ERR_NETWORK"
              ? "Cannot reach the server. Start the backend and try again."
              : "Login failed")
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <AuthLayout title="Welcome Back">
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

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
          type="password"
          placeholder="Password"
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
            ? "Logging in..."
            : "Login"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

const AuthLayout = ({
  title,
  children,
}) => (
  <div className="flex min-h-[80vh] items-center justify-center px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-8 text-center text-3xl font-bold">
        {title}
      </h1>

      {children}
    </div>
  </div>
);

export default Login;
