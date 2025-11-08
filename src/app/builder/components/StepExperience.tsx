"use client";

import { useResumeStore } from "../store/resumeStore";
import { ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function StepExperience() {
  const experiences = useResumeStore((s) => s.experiences);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  const onChange =
    (id: string, key: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateExperience(id, { [key]: e.target.value });
    };

  const handleAddExperience = () => {
    addExperience({
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      location: "",
      employmentType: "",
      bullets: [],
    });
  };

  const handleAddBullet = (expId: string) => {
    updateExperience(expId, {
      bullets: [
        ...(experiences.find((x) => x.id === expId)?.bullets || []),
        { id: Math.random().toString(36).slice(2, 9), text: "" },
      ],
    });
  };

  const handleBulletChange = (
    expId: string,
    bulletId: string,
    value: string
  ) => {
    const exp = experiences.find((x) => x.id === expId);
    if (!exp) return;
    const updatedBullets = exp.bullets.map((b) =>
      b.id === bulletId ? { ...b, text: value } : b
    );
    updateExperience(expId, { bullets: updatedBullets });
  };

  const handleRemoveBullet = (expId: string, bulletId: string) => {
    const exp = experiences.find((x) => x.id === expId);
    if (!exp) return;
    const updatedBullets = exp.bullets.filter((b) => b.id !== bulletId);
    updateExperience(expId, { bullets: updatedBullets });
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp) => (
        <div key={exp.id} className="border rounded-lg p-4 space-y-4 relative">
          {/* Remove Experience Button */}
          <button
            onClick={() => removeExperience(exp.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            title="Remove Experience"
          >
            <Trash2 size={18} />
          </button>

          {/* Role */}
          <div>
            <label className="text-sm text-gray-600">Role / Position</label>
            <input
              value={exp.role}
              onChange={onChange(exp.id, "role")}
              placeholder="e.g., Frontend Engineer"
              className="input mt-1"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm text-gray-600">Company</label>
            <input
              value={exp.company}
              onChange={onChange(exp.id, "company")}
              placeholder="e.g., Google"
              className="input mt-1"
            />
          </div>

          {/* Employment Type & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Employment Type</label>
              <input
                value={exp.employmentType}
                onChange={onChange(exp.id, "employmentType")}
                placeholder="e.g., Full-time / Internship"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Location</label>
              <input
                value={exp.location}
                onChange={onChange(exp.id, "location")}
                placeholder="e.g., Remote / Tunis, Tunisia"
                className="input mt-1"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                value={exp.startDate}
                onChange={onChange(exp.id, "startDate")}
                placeholder="e.g., Jan 2024"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                value={exp.endDate}
                onChange={onChange(exp.id, "endDate")}
                placeholder="e.g., Present"
                className="input mt-1"
              />
            </div>
          </div>

          {/* Bullets */}
          <div>
            <label className="text-sm text-gray-600">Key Achievements</label>
            <div className="space-y-2 mt-2">
              {exp.bullets.map((b) => (
                <div key={b.id} className="flex items-center gap-2">
                  <textarea
                    value={b.text}
                    onChange={(e) =>
                      handleBulletChange(exp.id, b.id, e.target.value)
                    }
                    placeholder="e.g., Improved load time by 30% using React optimization"
                    rows={2}
                    className="input flex-1"
                  />
                  <button
                    onClick={() => handleRemoveBullet(exp.id, b.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove bullet"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddBullet(exp.id)}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Bullet
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Experience Button */}
      <button
        onClick={handleAddExperience}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Experience
      </button>
    </div>
  );
}
