// app/resume/builder/components/LanguageSelector.tsx
"use client";

import { useResumeStore } from "../store/resumeStore";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const language = useResumeStore((s) => s.language);
  const setLanguage = useResumeStore((s) => s.setLanguage);

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
      <Globe className="w-4 h-4 text-gray-900" />
      <span className="text-sm text-gray-900">Language:</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className=" text-gray-900 text-sm border-none focus:outline-none focus:ring-0 bg-transparent cursor-pointer font-medium"
      >
        <option value="en" className="text-gray-900">🇬🇧 English</option>
        <option value="fr" className="text-gray-900">🇫🇷 Français</option>
      </select>
    </div>
  );
}