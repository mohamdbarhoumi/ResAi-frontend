"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UserPayload {
  email: string;
  password: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);

    const payload: UserPayload = { email, password };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "❌ Failed to create account");
        setLoading(false);
        return;
      }

      setMessage("✅ Account created successfully!");
      setLoading(false);

      router.push("/login");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6 py-10">
      <div className="bg-white w-full max-w-md shadow-lg rounded-2xl p-8">
        
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Create Your Account 👋
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Sign up to start using ResumeAi.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center text-sm font-medium ${
              message.includes("❌") || message.includes("⚠️")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="my-6 flex items-center justify-center">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>

        <button
          onClick={() => alert("Google login coming soon")}
          className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

      </div>

      <footer className="mt-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ResumeAi. All rights reserved.
      </footer>
    </main>
  );
}
