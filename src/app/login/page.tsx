"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation"; // ✅ Added for redirecting after login

interface UserPayload {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Added loading state
  const router = useRouter(); // ✅ Initialize router for navigation

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); // ✅ Show loading state

    const payload: UserPayload = { email, password };

    try {
      const res = await fetch("http://localhost:8081/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "❌ Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ Save token & user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("role", data.role);

      console.log("✅ Token saved:", data.token);
      setMessage("✅ Login successful!");
      setLoading(false);

      // ✅ Redirect to dashboard or home page
      router.push("/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
      setMessage("❌ Network or server error");
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back 👋
        </h1>
        <p className="text-gray-500 mb-8">
          Login or create your account to continue.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Continue"}
          </button>

          {/* Link to Signup */}
          <p className="mt-4 text-gray-500 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>

        {/* Message */}
        {message && (
          <p
            className={`mt-6 text-sm font-medium ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => alert("Google login coming soon")}
          className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ResumeAi. All rights reserved.
      </footer>
    </main>
  );
}
