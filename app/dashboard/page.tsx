"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:8081/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        localStorage.clear();
        router.push("/login");
      }
    });
  }, [router]);

return (
  <main className="min-h-screen bg-gray-100 px-6 py-10">
    {/* Top bar */}
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-2xl font-bold text-gray-800">ResumeAI Dashboard</h1>

      <div className="relative">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-10 h-10 rounded-full bg-[#1E88E5] text-white flex items-center justify-center cursor-pointer"
        >
          MB
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white shadow-xl border rounded-xl p-4 flex flex-col items-start">
            <div className="w-full flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1E88E5] text-white flex items-center justify-center">MB</div>
              <p className="text-gray-700 text-sm font-medium">mohamed@example.com</p>
            </div>

            <button
              onClick={() => {
                localStorage.clear();
                router.push("/login");
              }}
              className="mt-4 w-full py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>

    {/* Body */}
    <section className="flex items-start justify-start mt-16">
      <div
        onClick={() => router.push("/Tmplts")}
        className="w-56 h-72 bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition"
      >
        <span className="text-[#1E88E5] text-7xl leading-none font-semibold">+</span>
        <p className="text-gray-600 font-medium mt-3">Create New Resume</p>
      </div>
    </section>
  </main>
);
}