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
    <div className="space-y-4 w-full max-w-full">
      {/* Full Name */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>
        <input 
          value={fullName} 
          onChange={onChange("fullName")} 
          className="input w-full"
          placeholder="John Doe"
        />
      </div>

      {/* Job Title */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job title
        </label>
        <input 
          value={title} 
          onChange={onChange("title")} 
          className="input w-full"
          placeholder="Senior Software Engineer"
        />
      </div>

      {/* Email & Phone - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input 
            type="email"
            value={email} 
            onChange={onChange("email")} 
            className="input w-full"
            placeholder="john@example.com"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input 
            type="tel"
            value={phone} 
            onChange={onChange("phone")} 
            className="input w-full"
            placeholder="+1 234 567 890"
          />
        </div>
      </div>

      {/* Location */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input 
          value={location} 
          onChange={onChange("location")} 
          className="input w-full"
          placeholder="Tunis, Tunisia"
        />
      </div>

      {/* Professional Summary with AI */}
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <label className="text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
        </div>
        <textarea 
          value={summary} 
          onChange={onChange("summary")} 
          rows={4} 
          className="input w-full resize-none"
          placeholder="A brief summary of your professional background and goals..."
        />
        {!summary && (
          <p className="text-xs text-gray-500 mt-2 italic">
            💡 Click &quot;Generate with AI&quot; to create a professional summary
          </p>
        )}
      </div>

      {/* Social Links - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input 
            type="url"
            value={website} 
            onChange={onChange("website")} 
            className="input w-full"
            placeholder="https://yoursite.com"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub
          </label>
          <input 
            type="url"
            value={github} 
            onChange={onChange("github")} 
            className="input w-full"
            placeholder="https://github.com/username"
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn
          </label>
          <input 
            type="url"
            value={linkedin} 
            onChange={onChange("linkedin")} 
            className="input w-full"
            placeholder="https://linkedin.com/in/username"
          />
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