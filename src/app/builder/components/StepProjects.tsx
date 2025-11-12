"use client";

import { useResumeStore } from "../store/resumeStore";
import { ChangeEvent, useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import AIModal from "./AiModal";

export default function StepProjects() {
  const projects = useResumeStore((s) => s.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);

  const [techInput, setTechInput] = useState<{ [key: string]: string }>({});
  const [aiModalState, setAiModalState] = useState<{
    isOpen: boolean;
    projectId: string | null;
  }>({
    isOpen: false,
    projectId: null,
  });

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

  const handleBulletChange = (
    projId: string,
    bulletId: string,
    value: string
  ) => {
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
    setTechInput((prev) => ({ ...prev, [projId]: value }));
    const techArray =
      value.length > 0
        ? value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    updateProject(projId, { tech: techArray });
  };

  const getTechInput = (projId: string, tech: string[]) => {
    return techInput[projId] !== undefined
      ? techInput[projId]
      : tech.join(", ");
  };

  const handleOpenAIModal = (projId: string) => {
    setAiModalState({ isOpen: true, projectId: projId });
  };

  const handleAIGenerate = (generatedBullets: string) => {
    if (!aiModalState.projectId) return;

    const bulletLines = generatedBullets
      .split("\n")
      .filter((line) => line.trim().startsWith("•"))
      .map((line) => line.trim().substring(1).trim())
      .filter((text) => text.length > 0);

    const newBullets = bulletLines.map((text) => ({
      id: Math.random().toString(36).slice(2, 9),
      text,
    }));

    updateProject(aiModalState.projectId, { bullets: newBullets });
    setAiModalState({ isOpen: false, projectId: null });
  };

  const getCurrentProject = () => {
    if (!aiModalState.projectId) return null;
    return projects.find((proj) => proj.id === aiModalState.projectId);
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
            <label className="text-sm text-gray-600">
              Project Link (optional)
            </label>
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
            <label className="text-sm text-gray-600">
              Technologies (comma-separated)
            </label>
            <input
              value={getTechInput(proj.id, proj.tech)}
              onChange={(e) => handleTechChange(proj.id, e.target.value)}
              placeholder="e.g., React, TypeScript, Tailwind"
              className="input mt-1"
            />
          </div>

          {/* Bullets */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm text-gray-600">
                Key Features / Achievements
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddBullet(proj.id)}
                  className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
                >
                  <Plus size={14} /> Add Bullet
                </button>
                <button
                  onClick={() => handleOpenAIModal(proj.id)}
                  className="text-purple-500 hover:text-purple-700 flex items-center gap-1 text-sm"
                >
                  <Sparkles size={14} /> Generate with AI
                </button>
              </div>
            </div>

            {proj.bullets.map((b) => (
              <div key={b.id} className="flex gap-2 items-start">
                <textarea
                  value={b.text}
                  onChange={(e) =>
                    handleBulletChange(proj.id, b.id, e.target.value)
                  }
                  placeholder="Describe your achievement..."
                  className="input flex-1 mt-1"
                  rows={2}
                />
                <button
                  onClick={() => handleRemoveBullet(proj.id, b.id)}
                  className="text-red-400 hover:text-red-600 mt-1"
                  title="Remove Bullet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
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

      {/* AI Modal */}
      {aiModalState.isOpen && (
        <AIModal
          isOpen={aiModalState.isOpen}
          onClose={() => setAiModalState({ isOpen: false, projectId: null })}
          onApply={handleAIGenerate}
          type="project-bullets"
          context={{ projectTitle: getCurrentProject()?.title }}
        />
      )}
    </div>
  );
}
