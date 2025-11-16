// app/resume/builder/components/LanguageSelector.tsx
"use client";

import { useResumeStore } from "../store/resumeStore";
import { Globe } from "lucide-react";

export default function LanguageSelector() {
  const language = useResumeStore((s) => s.language);
  const setLanguage = useResumeStore((s) => s.setLanguage);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors">
      <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
      <span className="text-sm text-gray-700 font-medium hidden sm:inline">
        Language:
      </span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="text-gray-900 text-sm border-none focus:outline-none focus:ring-0 bg-transparent cursor-pointer font-medium pr-6"
      >
        <option value="en">🇬🇧 English</option>
        <option value="fr">🇫🇷 Français</option>
      </select>
    </div>
  );
}