/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import TabNav from "./components/TabNav";
import StepPersonal from "./components/StepPersonal";
import { useResumeStore } from "./store/resumeStore";
import Navbar from "../components/Navbar";
import StepExperience from "./components/StepExperience";
import StepProjects from "./components/StepProjects";
import dynamic from "next/dynamic";
import StepEducation from "./components/StepEducation";
import StepSkills from "./components/StepSkills";
import StepCertificates from "./components/StepCerts";
import StepLanguages from "./components/StepLanguages";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "../hooks/useAuthGuard";

const PDFPreviewWrapper = dynamic(
  () => import("./components/PdfPreviewWrapper"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Loading preview...
      </div>
    ),
  }
);

export default function ResumeBuilderPage() {
  useAuthGuard();
  const searchParams = useSearchParams();
  const resumeId = searchParams?.get("id") || null;
  
  const [activeTab, setActiveTab] = useState<string>("Personal");
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const tabs = [
    "Personal",
    "Experience",
    "Education",
    "Projects",
    "Skills",
    "Certificates",
    "Languages",
  ];

  const router = useRouter();

  // Load existing resume if editing
  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId);
      setIsEditMode(true);
    } else {
      // Clear store for new resume
      useResumeStore.getState().clearAll();
    }
  }, [resumeId]);

  const loadResume = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/resumes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load resume");
      }

      const { resume } = await response.json();
      
      // Load the resume data into the store
      if (resume.data) {
        useResumeStore.setState({
          ...resume.data,
          id: resume.id,
        });
        
        // Auto-update preview after loading
        setTimeout(() => {
          handleUpdatePreview();
        }, 100);
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      alert("Failed to load resume. Redirecting to dashboard...");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case "Personal":
        return <StepPersonal />;
      case "Experience":
        return <StepExperience />;
      case "Projects":
        return <StepProjects />;
      case "Education":
        return <StepEducation />;
      case "Skills":
        return <StepSkills />;
      case "Certificates":
        return <StepCertificates />;
      case "Languages":
        return <StepLanguages />;
      default:
        return (
          <div className="text-gray-500">
            Tab &quot;{activeTab}&quot; not implemented yet.
          </div>
        );
    }
  };

  const handleUpdatePreview = () => {
    const state = useResumeStore.getState();
    console.log("Preview Data:", state);
    const newSnapshot = JSON.parse(JSON.stringify(state));
    setSnapshot(null);
    setTimeout(() => {
      setSnapshot(newSnapshot);
      setPreviewKey((prev) => prev + 1);
    }, 0);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const resumeData = useResumeStore.getState();

      const payload = {
        title: resumeData.title || resumeData.fullName || "My Resume",
        data: resumeData,
        aiMetadata: null,
      };

      let response;
      
      if (isEditMode && resumeId) {
        // Update existing resume
        response = await fetch(`http://localhost:8081/api/resumes/update/${resumeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new resume
        response = await fetch("http://localhost:8081/api/resumes/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error("Failed to save resume");
      }

      const savedResume = await response.json();
      
      if (!isEditMode) {
        useResumeStore.setState({ id: savedResume.id });
      }
      
      alert(isEditMode ? "Resume updated successfully!" : "Resume saved successfully!");
      router.push(`/resume/${savedResume.id}/options`);
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Error saving resume.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title={isEditMode ? "Edit Resume" : "Builder page"} />
      <div className="pt-20 px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Form */}
          <section className="col-span-7 bg-white rounded-xl shadow p-6">
            {isEditMode && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✏️ You are editing an existing resume
                </p>
              </div>
            )}
            <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
            <div className="mt-4">{renderTab()}</div>
          </section>

          {/* Right: Preview */}
          <aside className="col-span-5">
            <div className="bg-white rounded-xl shadow p-4 flex flex-col h-[75vh]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Template preview</h3>
                <button
                  onClick={handleUpdatePreview}
                  className="px-3 py-1 bg-[#1E88E5] text-white rounded text-sm hover:bg-[#1565c0] transition"
                >
                  Update Preview
                </button>
              </div>

              {/* PDF Preview */}
              <div className="flex-1 overflow-hidden border rounded bg-gray-50">
                {snapshot ? (
                  <PDFPreviewWrapper key={previewKey} data={snapshot} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Click &quot;Update Preview&quot; to see your resume.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Resume"
                  : "Save Resume"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}