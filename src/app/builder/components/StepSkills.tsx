"use client";

import { useResumeStore } from "../store/resumeStore";
import { ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function StepSkills() {
  const skills = useResumeStore((s) => s.skills);
  const addSkill = useResumeStore((s) => s.addSkill);
  const updateSkill = useResumeStore((s) => s.updateSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);

  const onChange =
    (id: string) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      updateSkill(id, { name: e.target.value });
    };

  const handleAddSkill = () => {
    addSkill({ name: "" });
  };

  // Convert skills array into ATS-friendly comma-separated string
  const skillsString = skills.map((s) => s.name.trim()).filter(Boolean).join(", ");

  return (
    <div className="space-y-4">
      {/* Skills Inputs */}
      {skills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-2 relative border rounded-lg p-3 border-gray-400 bg-gray-50">
          <input
            value={skill.name}
            onChange={onChange(skill.id)}
            placeholder="e.g., React"
            className="input flex-1 border-gray-400 focus:border-blue-500"
          />
          <button
            onClick={() => removeSkill(skill.id)}
            className="text-red-600 hover:text-red-800"
            title="Remove Skill"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      {/* Add Skill Button */}
      <button
        onClick={handleAddSkill}
        className="w-full border-2 border-dashed border-gray-400 rounded-lg p-4 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Skill
      </button>

      {/* ATS Preview */}
      {skills.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 border border-gray-300 rounded">
          <strong>ATS Preview:</strong> Skills: {skillsString}
        </div>
      )}
    </div>
  );
}
