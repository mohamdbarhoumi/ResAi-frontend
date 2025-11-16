// app/resume/builder/components/TabNav.tsx
"use client";

import React from "react";

export default function TabNav({ 
  tabs, 
  active, 
  onChange 
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <nav className="border-b border-gray-200 pb-2 mb-4">
      {/* Desktop: Horizontal tabs */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              active === t 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Mobile: Dropdown select */}
      <div className="sm:hidden">
        <select
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {tabs.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}