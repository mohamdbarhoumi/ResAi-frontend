"use client";

import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import { useAuthGuard } from "../hooks/useAuthGuard";
import Image from "next/image";

export default function TemplatesPage() {
  const router = useRouter();
  useAuthGuard()
  

  return (
    <main className="min-h-screen bg-gray-100 px-6 pt-20">
      <Navbar title="Templates" />

      <h2 className="text-2xl font-bold text-gray-800 mb-8">
        Choose a resume template
      </h2>

      <div className="flex gap-6">
        {/* Template Card */}
        <div
          onClick={() => router.push("builder")}
          className="w-[210px] h-[297px] bg-white border shadow hover:shadow-xl transition rounded-lg cursor-pointer overflow-hidden"
        >
          <Image
            src="/templates/template1.png"
            alt="Michael Harris Template"
            width={210}
            height={297}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </main>
  );
}