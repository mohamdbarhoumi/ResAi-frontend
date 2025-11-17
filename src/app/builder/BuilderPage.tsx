"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Menu, X, Eye, Save, ArrowLeft } from "lucide-react";

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

  // ❗ FIX: Extract ID from dynamic route instead of query params
  const params = useParams();
  const resumeId = params?.id || null;

  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Personal");
  const [snapshot, setSnapshot] = useState(null);
  const [previewKey, setPreviewKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  const loadResume = async (id) => {
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
      case "Personal": return <StepPersonal />;
      case "Experience": return <StepExperience />;
      case "Projects": return <StepProjects />;
      case "Education": return <StepEducation />;
      case "Skills": return <StepSkills />;
      case "Certificates": return <StepCertificates />;
      case "Languages": return <StepLanguages />;
      default: return null;
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

    if (!token) {
      alert("You must be logged in to save.");
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      const state = useResumeStore.getState();

      if (!state.fullName || !state.email) {
        alert("Please fill in at least your name and email before saving.");
        setSaving(false);
        return;
      }

      const payload = {
        title: state.title || state.fullName || "My Resume",
        data: state,
        aiMetadata: null,
        language: state.language || "en",
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Save failed: ${response.status}`);
      }

      const saved = await response.json();

      // update state when creating new
      if (!isEditMode && saved.id) {
        useResumeStore.setState({ id: saved.id });
      }

      const redirectId = saved.id || resumeId;
      router.push(`/resume/${redirectId}/options`);
    } catch (error) {
      alert(`Error saving resume: ${error.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title={isEditMode ? "Edit Resume" : "Resume Builder"} />

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-30 flex items-center justify-between gap-3">
        <button
          onClick={() => setShowMobileMenu(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <Menu className="w-5 h-5" />
          <span className="text-sm font-medium">{activeTab}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              handleUpdatePreview();
              setShowMobilePreview(true);
            }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {showMobileMenu && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-lg">Sections</h3>
              <button onClick={() => setShowMobileMenu(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b">
              {isEditMode && (
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                  <p className="text-sm text-blue-800">✏️ Editing mode</p>
                </div>
              )}
              <LanguageSelector />
            </div>

            <nav className="p-3 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50 space-y-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE PREVIEW MODAL */}
      {showMobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Preview</h3>
              <button
                onClick={() => setShowMobilePreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {snapshot ? (
                <PDFPreviewWrapper key={previewKey} data={snapshot} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No preview available
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP MAIN CONTENT */}
      <div className="pt-32 lg:pt-20 px-4 sm:px-6 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FORM COLUMN */}
          <section className="lg:col-span-7">
            <div className="hidden lg:flex items-center justify-between mb-4">
              {isEditMode && (
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    ✏️ Editing existing resume
                  </p>
                </div>
              )}
              <LanguageSelector />
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="hidden lg:block">
                <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
              </div>

              <div className="mt-6">{renderTab()}</div>
            </div>
          </section>

          {/* DESKTOP PREVIEW COLUMN */}
          <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div
              className="bg-white rounded-xl shadow-md p-4 flex flex-col"
              style={{ height: "calc(100vh - 120px)" }}
            >
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <h3 className="font-semibold text-gray-800 text-lg">📄 Preview</h3>
                <button
                  onClick={handleUpdatePreview}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  🔄 Update
                </button>
              </div>

              <div className="flex-1 overflow-hidden border-2 border-gray-200 rounded-lg bg-gray-50">
                {snapshot ? (
                  <PDFPreviewWrapper key={previewKey} data={snapshot} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm px-4 text-center">
                    Click &quot;Update&quot; to generate preview
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : isEditMode ? "💾 Update" : "💾 Save"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
