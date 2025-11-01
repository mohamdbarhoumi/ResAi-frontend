"use client"; // Enable client-side interactivity

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UserPayload {
  email: string;
  password: string;
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const [comfirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if passwords match before sending request
    if (password !== comfirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

  

    const payload: UserPayload = { email, password };

    try {
      const res = await fetch("http://localhost:8081/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setMessage("❌ Failed to create account");
        return;
      }

      const data = await res.json();
      setMessage("✅ Account created successfully!");
      console.log("User:", data);

      // Optional: redirect to login after a short delay
        router.push("/login");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ An error occurred. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Account 👋
        </h1>
        <p className="text-gray-500 mb-8">
          Sign up to start using ResumeAi.
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

          <input
            type="password"
            placeholder="Confirm Password"
            value={comfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-6 text-sm font-medium text-gray-700">{message}</p>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center justify-center">
          <span className="h-px w-16 bg-gray-300"></span>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <span className="h-px w-16 bg-gray-300"></span>
        </div>

        {/* Google Login Button placeholder */}
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

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ResumeAi. All rights reserved.
      </footer>
    </main>
  );
}
