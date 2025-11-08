"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
  Promise.resolve().then(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);
  });
}, []);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-50">
      <h1 className="text-xl font-bold text-gray-800">ResumeAI</h1>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
        >
          👤
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-3">
            <p className="px-4 py-2 text-sm text-gray-600 border-b break-all">
              {email}
            </p>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
