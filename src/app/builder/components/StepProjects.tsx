"use client";

import { useResumeStore } from "../store/resumeStore";
import { ChangeEvent } from "react";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";

export default function StepProjects() {
  const projects = useResumeStore((s) => s.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  const onChange =
    (id: string, key: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateProject(id, { [key]: e.target.value });
    };

  const handleAddProject = () => {
    addProject({
      title: "",
      tech: [],
      link: "",
      startDate: "",
      endDate: "",
      bullets: [],
    });
  };

  const handleAddBullet = (projId: string) => {
    updateProject(projId, {
      bullets: [
        ...(projects.find((x) => x.id === projId)?.bullets || []),
        { id: Math.random().toString(36).slice(2, 9), text: "" },
      ],
    });
  };

  const handleBulletChange = (projId: string, bulletId: string, value: string) => {
    const proj = projects.find((x) => x.id === projId);
    if (!proj) return;
    const updatedBullets = proj.bullets.map((b) =>
      b.id === bulletId ? { ...b, text: value } : b
    );
    updateProject(projId, { bullets: updatedBullets });
  };

  const handleRemoveBullet = (projId: string, bulletId: string) => {
    const proj = projects.find((x) => x.id === projId);
    if (!proj) return;
    const updatedBullets = proj.bullets.filter((b) => b.id !== bulletId);
    updateProject(projId, { bullets: updatedBullets });
  };

  const handleTechChange = (projId: string, value: string) => {
    const techArray = value.split(",").map((t) => t.trim()).filter(Boolean);
    updateProject(projId, { tech: techArray });
  };

  return (
    <div className="space-y-6">
      {projects.map((proj) => (
        <div key={proj.id} className="border rounded-lg p-4 space-y-4 relative">
          {/* Remove Project Button */}
          <button
            onClick={() => removeProject(proj.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            title="Remove Project"
          >
            <Trash2 size={18} />
          </button>

          {/* Title */}
          <div>
            <label className="text-sm text-gray-600">Project Title</label>
            <input
              value={proj.title}
              onChange={onChange(proj.id, "title")}
              placeholder="e.g., Personal Portfolio Website"
              className="input mt-1"
            />
          </div>

          {/* Link */}
          <div>
            <label className="text-sm text-gray-600">Project Link (optional)</label>
            <input
              value={proj.link || ""}
              onChange={onChange(proj.id, "link")}
              placeholder="e.g., https://github.com/username/project"
              className="input mt-1"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Start Date</label>
              <input
                value={proj.startDate}
                onChange={onChange(proj.id, "startDate")}
                placeholder="e.g., Jan 2024"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">End Date</label>
              <input
                value={proj.endDate}
                onChange={onChange(proj.id, "endDate")}
                placeholder="e.g., Present"
                className="input mt-1"
              />
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="text-sm text-gray-600">Technologies (comma-separated)</label>
            <input
              value={proj.tech.join(", ")}
              onChange={(e) => handleTechChange(proj.id, e.target.value)}
              placeholder="e.g., React, TypeScript, Tailwind"
              className="input mt-1"
            />
          </div>

          {/* Bullets */}
          <div>
            <label className="text-sm text-gray-600">Key Features / Achievements</label>
            <div className="space-y-2 mt-2">
              {proj.bullets.map((b) => (
                <div key={b.id} className="flex items-center gap-2">
                  <textarea
                    value={b.text}
                    onChange={(e) => handleBulletChange(proj.id, b.id, e.target.value)}
                    placeholder="e.g., Implemented responsive design and CI/CD pipeline"
                    rows={2}
                    className="input flex-1"
                  />
                  <button
                    onClick={() => handleRemoveBullet(proj.id, b.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove bullet"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddBullet(proj.id)}
                className="text-blue-600 text-sm hover:underline"
              >
                + Add Bullet
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add Project Button */}
      <button
        onClick={handleAddProject}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Project
      </button>
    </div>
  );
}
