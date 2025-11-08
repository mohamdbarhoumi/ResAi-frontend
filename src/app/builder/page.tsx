/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import TabNav from "./components/TabNav";
import StepPersonal from "./components/StepPersonal";
import { useResumeStore } from "./store/resumeStore";
import Navbar from "../components/Navbar";
import StepExperience from "./components/StepExperience";
import StepProjects from "./components/StepProjects";
import dynamic from "next/dynamic";

// Create a wrapper component for the PDF Preview
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

// Dynamic Download Button
const DownloadButton = dynamic(
  () => import("./components/DownloadButton"),
  { ssr: false }
);

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<string>("Personal");
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);
  const [previewKey, setPreviewKey] = useState<number>(0);

  const tabs = ["Personal", "Experience", "Education", "Projects", "Skills"];

  const renderTab = () => {
    switch (activeTab) {
      case "Personal":
        return <StepPersonal />;
      case "Experience":
        return <StepExperience />;
      case "Projects":
        return <StepProjects />;
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
    // Create a deep clone to ensure React detects the change
    const newSnapshot = JSON.parse(JSON.stringify(state));
    // Force complete refresh by clearing first
    setSnapshot(null);
    setTimeout(() => {
      setSnapshot(newSnapshot);
      setPreviewKey((prev) => prev + 1);
    }, 0);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title="Builder page" />
      <div className="pt-20 px-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left: Form */}
          <section className="col-span-7 bg-white rounded-xl shadow p-6">
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
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Save (coming)
              </button>

              {snapshot && (
                <DownloadButton snapshot={snapshot} />
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}