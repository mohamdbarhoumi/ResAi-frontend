/* eslint-disable @typescript-eslint/no-explicit-any */
// app/resume/builder/page.tsx
"use client";

import { useState } from "react";
import TabNav from "./components/TabNav";
import StepPersonal from "./components/StepPersonal";
import TemplateMichael from "./preview/Template1";
import { useResumeStore } from "./store/resumeStore";

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState<string>("Personal");
  const [snapshot, setSnapshot] = useState<Record<string, any> | null>(null);

  const tabs = ["Personal", "Experience", "Education", "Projects", "Skills"];

  const renderTab = () => {
    switch (activeTab) {
      case "Personal":
        return <StepPersonal />;
      default:
        return <div className="text-gray-500">Tab &quot;{activeTab}&quot; not implemented yet.</div>;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20 px-6">
        <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: main form */}
          <section className="col-span-7 bg-white rounded-xl shadow p-6">
            <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />
            <div className="mt-4">{renderTab()}</div>
          </section>

          {/* Right: preview */}
          <aside className="col-span-5">
            <div className="bg-white rounded-xl shadow p-4 flex flex-col h-[75vh]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Template preview</h3>
                <button
                  onClick={() => setSnapshot(JSON.parse(JSON.stringify(useResumeStore.getState())))}
                  className="px-3 py-1 bg-[#1E88E5] text-white rounded"
                >
                  Update Preview
                </button>
              </div>

              <div className="flex-1 overflow-auto p-2 border rounded">
                {snapshot ? (
                  <TemplateMichael data={snapshot} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    Click “Update Preview” to render a live preview.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded">Save (coming)</button>
              <button className="flex-1 px-4 py-2 border rounded">Export PDF (coming)</button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
