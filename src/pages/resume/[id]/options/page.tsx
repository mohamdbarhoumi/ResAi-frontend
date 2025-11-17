"use client";

import { useState, useEffect, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../app/components/Navbar";
import PDFPreviewWrapper from "@/src/app/builder/components/PdfPreviewWrapper";
import DownloadButton from "@/src/app/builder/components/DownloadButton";
import { API_URL } from "@/src/config/api";

type Resume = {
  id: number;
  title: string;
  data: any;
  language: string;
  createdAt: string;
  updatedAt: string;
};

// --- Memoized PDF Preview ---
const MemoizedPDFPreview = memo(
  ({ data }: { data: any }) => {
    return (
      <div
        className="border rounded-lg bg-gray-50 overflow-hidden"
        style={{ height: "100%" }}
      >
        <PDFPreviewWrapper data={data} />
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Skip re-render if data is unchanged
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  }
);

MemoizedPDFPreview.displayName = "MemoizedPDFPreview";

export default function ResumeHubPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params?.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [tailoring, setTailoring] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  // --- Load Resume ---
  useEffect(() => {
    if (!resumeId) return;
    loadResume();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  const loadResume = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to load resume");

      const { resume } = await response.json();
      setResume(resume);
    } catch (error) {
      console.error("Error loading resume:", error);
      alert("Failed to load resume. Redirecting to dashboard...");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // --- Tailor Resume ---
  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first");
      return;
    }

    setTailoring(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/resumes/${resumeId}/tailor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobDescription }),
        }
      );

      if (!response.ok) throw new Error("Tailoring failed");

      // Reload resume to get updated data
      await loadResume();
      alert("Resume tailored successfully! Check the preview for changes.");
    } catch (error) {
      console.error("Tailoring error:", error);
      alert("Failed to tailor resume. Please try again.");
    } finally {
      setTailoring(false);
    }
  };

  // --- Generate Cover Letter ---
  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first");
      return;
    }

    setGenerating(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/resumes/${resumeId}/cover-letter`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobDescription }),
        }
      );

      if (!response.ok) throw new Error("Cover letter generation failed");

      const { coverLetter } = await response.json();
      setCoverLetter(coverLetter);
    } catch (error) {
      console.error("Cover letter error:", error);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // --- Copy Cover Letter to Clipboard ---
  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Cover letter copied to clipboard!");
  };

  // --- Download Cover Letter as TXT ---
  const handleDownloadCoverLetter = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume?.data.fullName || "Cover"}_Letter.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // --- Loading State ---
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </main>
    );
  }

  // --- Resume Not Found ---
  if (!resume) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Resume not found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title={resume.title} />

      <div className="pt-20 px-4 max-w-7xl mx-auto pb-10">
        {/* HEADER */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/builder?id=${resumeId}`)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ✏️ Edit Resume
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — PREVIEW */}
          <section className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Resume Preview
                </h2>
                <DownloadButton snapshot={resume.data} />
              </div>

              <div className="h-[75vh] bg-gray-50 rounded-lg overflow-hidden">
                <MemoizedPDFPreview data={resume.data} />
              </div>
            </div>

            {/* Tips Panel */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Save as &quot;FirstName_LastName_Resume.pdf&quot; for applications</li>
                <li>• Keep your resume under 2 pages for best results</li>
                <li>• Remove tables or images for ATS compatibility</li>
                <li>• Tailor your resume for each job application</li>
              </ul>
            </div>
          </section>

          {/* RIGHT — TOOLS */}
          <aside className="lg:col-span-5">
            {/* Tailor Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📝</span>
                <h2 className="text-lg font-semibold text-gray-900">
                  Tailor for Specific Job
                </h2>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Paste the job description here..."
              />

              <button
                disabled={tailoring || !jobDescription.trim()}
                onClick={handleTailorResume}
                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {tailoring ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Tailoring Resume...
                  </span>
                ) : (
                  "✨ Tailor Resume"
                )}
              </button>
            </div>

            {/* Cover Letter Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✉️</span>
                <h2 className="text-lg font-semibold text-gray-900">
                  Need a Cover Letter?
                </h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Generate a professional cover letter using your resume and the job description above.
              </p>

              <button
                disabled={generating || !jobDescription.trim()}
                onClick={handleGenerateCoverLetter}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {generating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </span>
                ) : (
                  "📧 Generate Cover Letter"
                )}
              </button>

              {coverLetter && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Your Cover Letter:
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {coverLetter}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleCopyCoverLetter}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={handleDownloadCoverLetter}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      💾 Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}