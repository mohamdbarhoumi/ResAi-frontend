"use client";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuthGuard } from "../hooks/useAuthGuard";

export default function Dashboard() {
  useAuthGuard()
  const router = useRouter()
  

return (
  <main className="min-h-screen bg-gray-100 px-6 py-10">
    <Navbar title="Dashboard" />
    <section className="flex items-start justify-start mt-16">
      <div
        onClick={() => router.push("/templates")}
        className="w-56 h-72 bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition"
      >
        <span className="text-[#1E88E5] text-7xl leading-none font-semibold">+</span>
        <p className="text-gray-600 font-medium mt-3">Create New Resume</p>
      </div>
    </section>
  </main>
);
}