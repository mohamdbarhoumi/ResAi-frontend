"use client";

import { ChangeEvent } from "react";
import { useResumeStore } from "../store/resumeStore";
import { Plus, Trash2 } from "lucide-react";

export default function StepLanguages() {
  const languages = useResumeStore((s) => s.languages);
  const addLanguage = useResumeStore((s) => s.addLanguage);
  const updateLanguage = useResumeStore((s) => s.updateLanguage);
  const removeLanguage = useResumeStore((s) => s.removeLanguage);

  const onChange =
    (id: string, key: string) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      updateLanguage(id, { [key]: e.target.value });
    };

  const handleAddLanguage = () => {
    addLanguage({ name: "", proficiency: "" });
  };

  return (
    <div className="space-y-6">
      {languages.map((lang) => (
        <div key={lang.id} className="border rounded-lg p-4 space-y-4 relative">
          {/* Remove Language Button */}
          <button
            onClick={() => removeLanguage(lang.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            title="Remove Language"
          >
            <Trash2 size={18} />
          </button>

          <div>
            <label className="text-sm text-gray-600">Language</label>
            <input
              value={lang.name}
              onChange={onChange(lang.id, "name")}
              placeholder="e.g., English"
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Proficiency (optional)</label>
            <input
              value={lang.proficiency}
              onChange={onChange(lang.id, "proficiency")}
              placeholder="e.g., Native / Fluent / Intermediate"
              className="input mt-1"
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleAddLanguage}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Language
      </button>
    </div>
  );
}
