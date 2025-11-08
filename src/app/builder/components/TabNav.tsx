// app/resume/builder/components/TabNav.tsx
"use client";

import React from "react";

export default function TabNav({ tabs, active, onChange }: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <nav className="flex gap-2 border-b pb-3">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-3 py-2 rounded ${
            active === t ? "bg-[#1E88E5] text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {t}
        </button>
      ))}
    </nav>
  );
}
