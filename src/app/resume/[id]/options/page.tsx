"use client";

import { useState, useEffect, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
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
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingDOCX, setDownloadingDOCX] = useState(false);

  // --- Load Resume ---
  useEffect(() => {
    if (!resumeId) return;
    loadResume();
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
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // --- PDF Download ---
  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/resumes/${resumeId}/download/pdf`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("PDF download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.data.fullName || "Resume"}_Resume.pdf`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    } finally {
      setDownloadingPDF(false);
    }
  };

  // --- DOCX Download ---
  const handleDownloadDOCX = async () => {
    setDownloadingDOCX(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/resumes/${resumeId}/download/docx`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("DOCX download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.data.fullName || "Resume"}_Resume.docx`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      alert("Failed to download DOCX");
    } finally {
      setDownloadingDOCX(false);
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

      await loadResume();
      alert("Resume tailored successfully!");
    } catch (error) {
      console.error("Tailoring error:", error);
      alert("Tailoring failed.");
    } finally {
      setTailoring(false);
    }
  };

  // --- Generate Cover Letter ---
  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      alert("Paste a job description first");
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

      if (!response.ok) throw new Error("Cover letter failed");

      const { coverLetter } = await response.json();
      setCoverLetter(coverLetter);
    } catch (error) {
      console.error("Cover letter error:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );

  if (!resume)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Resume not found
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title={resume.title} />

      <div className="pt-20 px-4 max-w-7xl mx-auto pb-10">
        {/* HEADER */}
        <div className="mb-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">{resume.title}</h1>
            <p className="text-sm text-gray-500">
              Last updated:{" "}
              {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/builder?id=${resumeId}`)}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              ✏️ Edit Resume
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT — PREVIEW */}
          <section className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Preview</h2>
                <DownloadButton snapshot={resume.data} />
              </div>

              <div className="h-[75vh] bg-gray-50 rounded-lg overflow-hidden">
                <MemoizedPDFPreview data={resume.data} />
              </div>
            </div>
          </section>

          {/* RIGHT — TOOLS */}
          <aside className="lg:col-span-5">
            {/* Tailor Section */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2">Tailor Resume</h2>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 p-3 border rounded-lg"
                placeholder="Paste job description..."
              />

              <button
                disabled={tailoring || !jobDescription.trim()}
                onClick={handleTailorResume}
                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg"
              >
                {tailoring ? "Tailoring..." : "✨ Tailor Resume"}
              </button>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Cover Letter</h2>

              <button
                disabled={generating || !jobDescription.trim()}
                onClick={handleGenerateCoverLetter}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg"
              >
                {generating ? "Generating..." : "📧 Generate Cover Letter"}
              </button>

              {coverLetter && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border max-h-80 overflow-auto whitespace-pre-wrap">
                  {coverLetter}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
