/* eslint-disable @typescript-eslint/no-explicit-any */
// app/resume/builder/page.tsx
"use client";

import { useState, useMemo } from "react";
import TabNav from "./components/TabNav";
import StepPersonal from "./components/StepPersonal";
import MyResumePDF from "./preview/Template1";
import { useResumeStore } from "./store/resumeStore";
import Navbar from "../components/Navbar";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<string>("Personal");
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);

  const tabs = ["Personal", "Experience", "Education", "Projects", "Skills"];

  const renderTab = () => {
    switch (activeTab) {
      case "Personal":
        return <StepPersonal />;
      default:
        return (
          <div className="text-gray-500">
            Tab &quot;{activeTab}&quot; not implemented yet.
          </div>
        );
    }
  };

  // Memoize the PDF document — only re-creates when snapshot changes
  const MemoizedPDF = useMemo(() => {
    if (!snapshot) return null;
    return <MyResumePDF data={snapshot} />;
  }, [snapshot]);

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
                  onClick={() => {
                    const state = useResumeStore.getState();
                    console.log("Preview Data:", state); // DEBUG
                    setSnapshot(JSON.parse(JSON.stringify(state)));
                  }}
                  className="px-3 py-1 bg-[#1E88E5] text-white rounded text-sm hover:bg-[#1565c0] transition"
                >
                  Update Preview
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 overflow-hidden border rounded bg-gray-50">
                {MemoizedPDF ? (
                  <PDFViewer
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                    showToolbar={false}
                  >
                    {MemoizedPDF}
                  </PDFViewer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Click “Update Preview” to see your resume.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Save (coming)
              </button>

              {MemoizedPDF && (
                <PDFDownloadLink
                  document={MemoizedPDF}
                  fileName={`${snapshot?.fullName?.trim() || "Resume"}.pdf`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded text-center text-gray-700 hover:bg-gray-50 transition"
                >
                  {({ loading }) =>
                    loading ? "Generating…" : "Export PDF"
                  }
                </PDFDownloadLink>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}