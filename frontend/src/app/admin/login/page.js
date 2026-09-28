"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

      const loggedInUser = result.data?.user || result.user;

      if (loggedInUser?.role !== "admin") {
        throw new Error("This account does not have admin access.");
      }

      const credentials = {
        token: result.data?.token || result.token,
        user: loggedInUser,
      };

      dispatch(setCredentials(credentials));
      localStorage.setItem("shopin-auth", JSON.stringify(credentials));
      router.replace("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <p className="section-label">SHOPIN ADMIN</p>
        <h1>Admin Login</h1>
        <p>Sign in with an administrator account to manage the store.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="shopinadmin"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              required
            />
          </label>

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <button
          type="button"
          className="admin-back-button"
          onClick={() => router.push("/")}
        >
          Back to Shop
        </button>
      </section>
    </main>
  );
}