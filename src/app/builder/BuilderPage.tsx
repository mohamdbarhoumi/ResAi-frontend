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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      default:
        return null;
    }
  };

  const handleUpdatePreview = () => {
    const state = useResumeStore.getState();
    const newSnapshot = JSON.parse(JSON.stringify(state));

    setSnapshot(null);

    requestAnimationFrame(() => {
      setSnapshot(newSnapshot);
      setPreviewKey((k) => k + 1);
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
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title={isEditMode ? "Edit Resume" : "Resume Builder"} />

      <div className="pt-20 px-3 sm:px-6 pb-8 max-w-7xl mx-auto">
        
        {/* Edit Mode Badge + Language Selector - Mobile Friendly */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {isEditMode && (
            <div className="inline-flex items-center px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg w-fit">
              <p className="text-sm text-blue-800">✏️ Editing existing resume</p>
            </div>
          )}
          <div className="w-fit">
            <LanguageSelector />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN - Form */}
          <section className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              
              {/* Tab Navigation */}
              <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />

              {/* Form Content */}
              <div className="mt-6">
                {renderTab()}
              </div>
            </div>

            {/* Mobile: Update Preview & Show/Hide Preview Buttons */}
            <div className="lg:hidden space-y-3">
              <button
                onClick={handleUpdatePreview}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                🔄 Update Preview
              </button>

              <button
                onClick={() => setShowMobilePreview((s) => !s)}
                className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium border border-gray-300 hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                {showMobilePreview ? "👁️ Hide Preview" : "👁️ Show Preview"}
              </button>

              {/* Mobile: Save/Cancel Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Saving..." : isEditMode ? "💾 Update" : "💾 Save"}
                </button>
              </div>
            </div>

            {/* Mobile Preview Section */}
            {showMobilePreview && (
              <div className="lg:hidden bg-white rounded-xl shadow-md p-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                  📄 Preview
                </h3>
                <div className="border-2 border-gray-200 rounded-lg bg-gray-50 overflow-hidden" style={{ height: '70vh' }}>
                  {snapshot ? (
                    <PDFPreviewWrapper key={previewKey} data={snapshot} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                      Tap &quot;Update Preview&quot; above to generate your resume preview
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* RIGHT COLUMN - Desktop Preview & Actions */}
          <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl shadow-md p-4 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
              
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <h3 className="font-semibold text-gray-800 text-lg">📄 Preview</h3>
                <button
                  onClick={handleUpdatePreview}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  🔄 Update
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 overflow-hidden border-2 border-gray-200 rounded-lg bg-gray-50">
                {snapshot ? (
                  <PDFPreviewWrapper key={previewKey} data={snapshot} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                    Click &quot;Update&quot; to generate your resume preview
                  </div>
                )}
              </div>

              {/* Desktop Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 active:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? "Saving..." : isEditMode ? "💾 Update Resume" : "💾 Save Resume"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}