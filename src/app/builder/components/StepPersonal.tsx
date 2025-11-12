"use client";

import { useResumeStore } from "../store/resumeStore";
import { ChangeEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import AIModal from "./AiModal";

export default function StepPersonal() {
  const fullName = useResumeStore((s) => s.fullName);
  const title = useResumeStore((s) => s.title);
  const email = useResumeStore((s) => s.email);
  const phone = useResumeStore((s) => s.phone);
  const location = useResumeStore((s) => s.location);
  const summary = useResumeStore((s) => s.summary);
  const website = useResumeStore((s) => s.website);
  const github = useResumeStore((s) => s.github);
  const linkedin = useResumeStore((s) => s.linkedin);

  const setPersonal = useResumeStore((s) => s.setPersonal);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const onChange =
    (key: keyof Parameters<typeof setPersonal>[0]) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPersonal({ [key]: e.target.value });
    };

  const handleAIGenerate = (generatedSummary: string) => {
    setPersonal({ summary: generatedSummary });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-600">Full name</label>
        <input value={fullName} onChange={onChange("fullName")} className="input mt-1"/>
      </div>

      <div>
        <label className="text-sm text-gray-600">Job title</label>
        <input value={title} onChange={onChange("title")} className="input mt-1"/>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input value={email} onChange={onChange("email")} className="input mt-1"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">Phone</label>
          <input value={phone} onChange={onChange("phone")} className="input mt-1"/>
        </div>
      </div>

      <div>
        <label className="text-sm text-gray-600">Location</label>
        <input value={location} onChange={onChange("location")} className="input mt-1"/>
      </div>

      {/* Professional Summary with AI */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-600">Professional Summary</label>
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
        <textarea 
          value={summary} 
          onChange={onChange("summary")} 
          rows={4} 
          className="input mt-1"
          placeholder="A brief summary of your professional background and goals..."
        />
        {!summary && (
          <p className="text-xs text-gray-500 mt-1">
            💡 Click &quot;Generate with AI&quot; to create a professional summary based on your background
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-sm text-gray-600">Website</label>
          <input value={website} onChange={onChange("website")} className="input mt-1"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">GitHub</label>
          <input value={github} onChange={onChange("github")} className="input mt-1"/>
        </div>
        <div>
          <label className="text-sm text-gray-600">LinkedIn</label>
          <input value={linkedin} onChange={onChange("linkedin")} className="input mt-1"/>
        </div>
      </div>

      {/* AI Modal */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApply={handleAIGenerate}
        type="summary"
      />
    </div>
  );
}