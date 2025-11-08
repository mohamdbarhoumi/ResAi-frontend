"use client";

import { useResumeStore, Education } from "../store/resumeStore";
import { ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function StepEducation() {
  const educations = useResumeStore((s) => s.educations);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

  const onChange =
    (id: string, key: string) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      updateEducation(id, { [key]: e.target.value });
    };

  const handleAddEducation = () => {
    addEducation({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      honors: "",
    });
  };

  return (
    <div className="space-y-6">
      {educations.map((edu) => (
        <div key={edu.id} className="border rounded-lg p-4 space-y-4 relative">
          {/* Remove Education Button */}
          <button
            onClick={() => removeEducation(edu.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            title="Remove Education"
          >
            <Trash2 size={18} />
          </button>

          {/* Degree */}
          <div>
            <label className="text-sm text-gray-600">Degree</label>
            <input
              value={edu.degree}
              onChange={onChange(edu.id, "degree")}
              placeholder="e.g., B.Sc. in Computer Science"
              className="input mt-1"
            />
          </div>

          {/* Institution */}
          <div>
            <label className="text-sm text-gray-600">Institution</label>
            <input
              value={edu.institution}
              onChange={onChange(edu.id, "institution")}
              placeholder="e.g., University of Tunis"
              className="input mt-1"
            />
          </div>

          {/* Location & GPA */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Location</label>
              <input
                value={edu.location}
                onChange={onChange(edu.id, "location")}
                placeholder="e.g., Tunis, Tunisia"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">GPA (optional)</label>
              <input
                value={edu.gpa || ""}
                onChange={onChange(edu.id, "gpa")}
                placeholder="e.g., 3.8/4.0"
                className="input mt-1"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                value={edu.startDate}
                onChange={onChange(edu.id, "startDate")}
                placeholder="e.g., Sep 2020"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                value={edu.endDate}
                onChange={onChange(edu.id, "endDate")}
                placeholder="e.g., Jun 2024 or Present"
                className="input mt-1"
              />
            </div>
          </div>

          {/* Honors */}
          <div>
            <label className="text-sm text-gray-600">Honors (optional)</label>
            <input
              value={edu.honors || ""}
              onChange={onChange(edu.id, "honors")}
              placeholder="e.g., Summa Cum Laude"
              className="input mt-1"
            />
          </div>
        </div>
      ))}

      {/* Add Education Button */}
      <button
        onClick={handleAddEducation}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Education
      </button>
    </div>
  );
}