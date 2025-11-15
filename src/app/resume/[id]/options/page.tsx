"use client";

import { useState, useEffect, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import PDFPreviewWrapper from "@/src/app/builder/components/PdfPreviewWrapper";
import DownloadButton from "@/src/app/builder/components/DownloadButton";

type Resume = {
  id: number;
  title: string;
  data: any;
  language: string;
  createdAt: string;
  updatedAt: string;
};

// Separate memoized component for PDF preview
const MemoizedPDFPreview = memo(({ data }: { data: any }) => {
  return (
    <div className="border rounded-lg bg-gray-50 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
      <PDFPreviewWrapper data={data} />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if data actually changed
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});

MemoizedPDFPreview.displayName = 'MemoizedPDFPreview';

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

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  const loadResume = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/resumes/${resumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load resume");
      }

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

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/resumes/${resumeId}/download/pdf`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("PDF download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.data.fullName || "Resume"}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleDownloadDOCX = async () => {
    setDownloadingDOCX(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/resumes/${resumeId}/download/docx`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("DOCX download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.data.fullName || "Resume"}_Resume.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading DOCX:", error);
      alert("Failed to download DOCX");
    } finally {
      setDownloadingDOCX(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first");
      return;
    }

    setTailoring(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/resumes/${resumeId}/tailor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobDescription: jobDescription,
          }),
        }
      );

      if (!response.ok) throw new Error("Tailoring failed");

      const result = await response.json();
      
      // Reload the resume with tailored content
      await loadResume();
      alert("Resume tailored successfully! Review the changes in the preview.");
    } catch (error) {
      console.error("Error tailoring resume:", error);
      alert("Failed to tailor resume. Please try again.");
    } finally {
      setTailoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      alert("Please paste a job description first");
      return;
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8081/api/resumes/${resumeId}/cover-letter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobDescription: jobDescription,
          }),
        }
      );

      if (!response.ok) throw new Error("Cover letter generation failed");

      const { coverLetter } = await response.json();
      setCoverLetter(coverLetter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setGenerating(false);
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

  if (!resume) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Resume not found</p>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-gray-50">
    <Navbar title={resume.title} />

    <div className="pt-20 px-4 sm:px-6 max-w-7xl mx-auto pb-10">
      {/* Header Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push(`/builder?id=${resumeId}`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto"
          >
            ✏️ Edit Resume
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition w-full sm:w-auto"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Preview */}
        <section className="lg:col-span-7 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 
                          lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Resume Preview
              </h2>
              <div className="flex gap-2">
                <DownloadButton snapshot={resume.data} />
              </div>
            </div>

            {/* Responsive PDF Preview Container */}
            <div className="h-[70vh] sm:h-[75vh] lg:h-[calc(100vh-200px)] border rounded-md bg-gray-50 overflow-hidden">
              <MemoizedPDFPreview data={resume.data} />
            </div>
          </div>
        </section>

        {/* Right Column - Job Tools */}
        <aside className="lg:col-span-5 order-1 lg:order-2">
          
          {/* Job Tailoring Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-lg font-semibold text-gray-900">
                Tailor for Specific Job
              </h2>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-40 sm:h-48 p-3 border border-gray-300 rounded-lg 
                         text-sm focus:ring-2 focus:ring-blue-500 resize-none text-gray-900"
            />

            <button
              onClick={handleTailorResume}
              disabled={tailoring || !jobDescription.trim()}
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white 
                         rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
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

            <p className="text-xs text-gray-500 mt-2 italic">
              💡 Our AI optimizes your resume for the exact job description.
            </p>
          </div>

          {/* Cover Letter Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✉️</span>
              <h2 className="text-lg font-semibold text-gray-900">
                Need a Cover Letter?
              </h2>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Generate a tailored cover letter using your resume + job description.
            </p>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={generating || !jobDescription.trim()}
              className="w-full px-4 py-3 bg-green-600 text-white 
                         rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
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

            {/* Cover letter output */}
            {coverLetter && (
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Your Cover Letter:
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-auto border">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {coverLetter}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter);
                      alert("Cover letter copied!");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    📋 Copy
                  </button>

                  <button
                    onClick={() => {
                      const blob = new Blob([coverLetter], { type: "text/plain" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${resume.data.fullName || "Cover"}_Letter.txt`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
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