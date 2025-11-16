"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import Navbar from "../components/Navbar";
import TabNav from "./components/TabNav";
import StepPersonal from "./components/StepPersonal";
import StepExperience from "./components/StepExperience";
import StepProjects from "./components/StepProjects";
import StepEducation from "./components/StepEducation";
import StepSkills from "./components/StepSkills";
import StepCertificates from "./components/StepCerts";
import StepLanguages from "./components/StepLanguages";
import LanguageSelector from "./components/LanguageSelector";

import { useResumeStore } from "./store/resumeStore";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { API_URL } from "@/src/config/api";

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
  const resumeId = searchParams?.get("id") ?? null;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Personal");
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const tabs = [
    "Personal",
    "Experience",
    "Education",
    "Projects",
    "Skills",
    "Certificates",
    "Languages",
  ];

  useEffect(() => {
    if (resumeId) {
      setIsEditMode(true);
      loadResume(resumeId);
    } else {
      useResumeStore.getState().clearAll();
    }
  }, [resumeId]);

  const loadResume = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load resume");

      const { resume } = await response.json();

      if (resume.data) {
        useResumeStore.setState({
          ...resume.data,
          id: resume.id,
          language: resume.language || resume.data.language || "en",
        });

        setTimeout(() => handleUpdatePreview(), 120);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load resume. Redirecting...");
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
    }
  };

  const handleUpdatePreview = () => {
    const state = useResumeStore.getState();
    const newSnapshot = JSON.parse(JSON.stringify(state));

    setSnapshot(null);

    requestAnimationFrame(() => {
      setSnapshot(newSnapshot);
      setPreviewKey((prev) => prev + 1);
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const state = useResumeStore.getState();

      const payload = {
        title: state.title || state.fullName || "My Resume",
        data: state,
        aiMetadata: null,
        language: state.language,
      };

      const url = isEditMode
        ? `${API_URL}/api/resumes/update/${resumeId}`
        : `${API_URL}/api/resumes/create`;

      const response = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save resume");

      const saved = await response.json();

      if (!isEditMode) {
        useResumeStore.setState({ id: saved.id });
      }

      router.push(`/resume/${saved.id}/options`);
    } catch (error) {
      console.error(error);
      alert("Error saving resume.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      <Navbar title={isEditMode ? "Edit Resume" : "Resume Builder"} />

      <div className="pt-20 px-3 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT SIDE */}
          <section className="lg:col-span-7 bg-white rounded-xl shadow p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
              {isEditMode && (
                <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  ✏️ Editing an existing resume
                </div>
              )}
              <LanguageSelector />
            </div>

            <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />

            <div className="mt-5">{renderTab()}</div>

            {/* MOBILE PREVIEW TOGGLE */}
            <button
              className="lg:hidden mt-6 w-full py-3 rounded-lg bg-blue-600 text-white font-medium active:scale-[0.98] transition"
              onClick={() => setShowMobilePreview(!showMobilePreview)}
            >
              {showMobilePreview ? "Hide Preview" : "Show Preview"}
            </button>

            {showMobilePreview && (
              <div className="mt-4 border rounded-xl bg-white p-3 sm:p-4">
                {snapshot ? (
                  <PDFPreviewWrapper key={previewKey} data={snapshot} />
                ) : (
                  <p className="text-center text-gray-400 text-sm">
                    Tap “Update Preview” to see the resume preview.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* RIGHT SIDE DESKTOP PREVIEW */}
          <aside className="hidden lg:block lg:col-span-5">
            <div className="bg-white rounded-xl shadow p-4 h-[75vh] flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Template Preview</h3>
                <button
                  onClick={handleUpdatePreview}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 active:scale-[0.98]"
                >
                  Update Preview
                </button>
              </div>

              <div className="flex-1 overflow-hidden border rounded bg-gray-50">
                {snapshot ? (
                  <PDFPreviewWrapper key={previewKey} data={snapshot} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Click “Update Preview” to generate your resume.
                  </div>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 active:scale-[0.98]"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 active:scale-[0.98]"
              >
                {saving ? "Saving..." : isEditMode ? "Update Resume" : "Save Resume"}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
