"use client";

import { useState, useEffect, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../app/components/Navbar";
import PDFPreviewWrapper from "@/src/app/builder/components/PdfPreviewWrapper";
import DownloadButton from "@/src/app/builder/components/DownloadButton";
import { useAuthGuard } from "../../../../app/hooks/useAuthGuard";

const API_URL = "https://resai-backend.onrender.com";

type Resume = {
  id: number;
  title: string;
  data: any;
  language: string;
  createdAt: string;
  updatedAt: string;
};

const MemoizedPDFPreview = memo(
  ({ data }: { data: any }) => (
    <div className="border rounded-lg bg-gray-50 overflow-hidden h-full">
      <PDFPreviewWrapper data={data} />
    </div>
  ),
  (prev, next) => JSON.stringify(prev.data) === JSON.stringify(next.data)
);

MemoizedPDFPreview.displayName = "MemoizedPDFPreview";

export default function ResumeHubPage() {
  useAuthGuard();

  const params = useParams();
  const router = useRouter();
  const resumeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [tailoring, setTailoring] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  // Load resume immediately when ID is available
  useEffect(() => {
    if (resumeId) loadResume();
  }, [resumeId]);

  const loadResume = async (retryCount = 0) => {
    if (!resumeId) {
      setError("No resume ID provided");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const url = `${API_URL}/api/resumes/${resumeId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const responseText = await res.text();

      if (!res.ok) {
        if ((res.status === 404 || res.status === 500) && retryCount < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          return loadResume(retryCount + 1);
        }
        throw new Error(`HTTP ${res.status}: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      const resumeData = data.resume ?? data;

      if (!resumeData?.id || !resumeData?.data) {
        throw new Error("Invalid resume data received");
      }

      setResume(resumeData);
      setError(null);
    } catch (err: any) {
      console.error("Load error:", err);
      setError(err.message);
      if (retryCount >= 3) {
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) {
      return alert("Please paste a job description first.");
    }

    setTailoring(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/resumes/${resumeId}/tailor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Tailoring failed (${response.status})`);
      }

      await loadResume();
      alert("Resume tailored successfully! Preview updated below.");
      setJobDescription("");
    } catch (err: any) {
      console.error("Tailor error:", err);
      alert(`Failed to tailor resume: ${err.message}`);
    } finally {
      setTailoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      return alert("Please paste a job description first.");
    }

    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/resumes/${resumeId}/cover-letter`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate cover letter");
      }

      const { coverLetter } = await response.json();
      setCoverLetter(coverLetter);
    } catch (err: any) {
      console.error("Cover letter error:", err);
      alert(`Failed to generate cover letter: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Copied to clipboard!");
  };

  const handleDownloadCoverLetter = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume?.data?.fullName?.replace(/\s+/g, "_") || "Cover"}_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading / Error States
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </main>
    );
  }

  if (error || !resume) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <p className="text-red-800 font-semibold">Failed to load resume</p>
            <p className="text-sm text-red-600 mt-2">{error || "Resume not found"}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => loadResume()} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Retry
            </button>
            <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg">
              Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar title={resume.title} />

      <div className="pt-20 px-4 max-w-7xl mx-auto pb-10">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{resume.title}</h1>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/builder?id=${resumeId}`)}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Edit Resume
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Preview */}
          <section className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
                <DownloadButton snapshot={resume.data} />
              </div>
              <div className="h-[75vh] rounded-lg overflow-hidden border">
                <MemoizedPDFPreview data={resume.data} />
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Name your file: FirstName_LastName_Resume.pdf</li>
                <li>• Keep it under 2 pages</li>
                <li>• Avoid tables & images for ATS compatibility</li>
                <li>• Always tailor your resume!</li>
              </ul>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Tailor Resume */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">Target</span>
                <h2 className="text-lg font-semibold text-gray-900">Tailor for Job</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
              <button
                onClick={handleTailorResume}
                disabled={tailoring || !jobDescription.trim()}
                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
              >
                {tailoring ? "Tailoring your resume..." : "Tailor Resume"}
              </button>
            </div>

            {/* Cover Letter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">Letter</span>
                <h2 className="text-lg font-semibold text-gray-900">Cover Letter</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Generate a tailored cover letter using your resume + job description.
              </p>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={generating || !jobDescription.trim()}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition"
              >
                {generating ? "Generating..." : "Generate Cover Letter"}
              </button>

              {coverLetter && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Your Cover Letter</h3>
                  <div className="bg-gray-50 p-5 rounded-lg max-h-96 overflow-auto text-sm whitespace-pre-wrap font-medium">
                    {coverLetter}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleCopyCoverLetter}
                      className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      Copy
                    </button>
                    <button
                      onClick={handleDownloadCoverLetter}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      Download .txt
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