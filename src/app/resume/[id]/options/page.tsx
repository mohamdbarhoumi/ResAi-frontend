"use client";

import { useState, useEffect, memo } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../../app/components/Navbar";
import PDFPreviewWrapper from "@/src/app/builder/components/PdfPreviewWrapper";
import DownloadButton from "@/src/app/builder/components/DownloadButton";
import { useAuthGuard } from "../../../hooks/useAuthGuard";

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
  useAuthGuard(); // Add auth guard
  
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

  useEffect(() => {
    if (resumeId) {
      // Small delay to ensure backend has saved
      const timer = setTimeout(() => {
        loadResume();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [resumeId]);

  const loadResume = async (retryCount = 0) => {
    if (!resumeId) {
      console.error("❌ No resume ID");
      setError("No resume ID provided");
      setLoading(false);
      return;
    }

    console.log("🔵 Starting load attempt", retryCount + 1, "for resume ID:", resumeId);
    
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("❌ No token, redirecting to login");
        router.push("/login");
        return;
      }

      const url = `${API_URL}/api/resumes/${resumeId}`;
      console.log("🔵 Fetching from:", url);
      console.log("🔵 Token preview:", token.substring(0, 20) + "...");

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      console.log("🔵 Response status:", res.status);
      console.log("🔵 Response headers:", Object.fromEntries(res.headers.entries()));

      // Get response text first to handle both JSON and non-JSON responses
      const responseText = await res.text();
      console.log("🔵 Raw response:", responseText.substring(0, 500));

      if (!res.ok) {
        console.error("❌ Response not OK:", res.status, responseText);
        
        // Retry logic for 404 or 500 errors (backend might be slow)
        if ((res.status === 404 || res.status === 500) && retryCount < 3) {
          console.log(`⏳ Retry ${retryCount + 1}/3 in 1.5 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
          return loadResume(retryCount + 1);
        }
        
        throw new Error(`HTTP ${res.status}: ${responseText}`);
      }

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log("✅ Parsed JSON:", data);
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e);
        throw new Error("Invalid JSON response from server");
      }

      // Handle multiple possible response formats
      let resumeData;
      
      if (data.resume) {
        console.log("✅ Using data.resume format");
        resumeData = data.resume;
      } else if (data.data && data.id) {
        console.log("✅ Using direct resume format");
        resumeData = data;
      } else if (Array.isArray(data) && data.length > 0) {
        console.log("✅ Using array format (taking first item)");
        resumeData = data[0];
      } else {
        console.error("❌ Unrecognized format:", Object.keys(data));
        throw new Error("Unexpected response format");
      }

      if (!resumeData?.id || !resumeData?.data) {
        console.error("❌ Invalid resume data:", resumeData);
        throw new Error("Resume missing required fields (id or data)");
      }

      console.log("✅ Successfully loaded resume:", resumeData.id);
      setResume(resumeData);
      setError(null);
      
    } catch (error: any) {
      console.error("❌ Load error:", error);
      setError(error.message);
      
      // Only redirect after final retry
      if (retryCount >= 3) {
        alert(`Failed to load resume: ${error.message}\n\nRedirecting to dashboard...`);
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description");

    setTailoring(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🎯 Starting tailoring for resume:", resumeId);
      
      const res = await fetch(`${API_URL}/api/resumes/${resumeId}/tailor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      console.log("🎯 Tailoring response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Tailoring failed:", errorText);
        throw new Error(`Tailoring failed: ${errorText}`);
      }

      const responseData = await res.json();
      console.log("✅ Tailoring response:", responseData);

      // Check if the response includes the updated resume
      if (responseData.resume) {
        console.log("✅ Setting tailored resume from response");
        setResume(responseData.resume);
      } else if (responseData.data) {
        console.log("✅ Setting tailored resume (alternate format)");
        setResume(responseData);
      } else {
        // If response doesn't include resume, reload from server with delay
        console.log("⏳ Waiting 2 seconds before reloading...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await loadResume();
      }

      alert("Resume tailored successfully! The changes are now visible.");
    } catch (error: any) {
      console.error("❌ Tailoring error:", error);
      alert(`Failed to tailor resume: ${error.message}`);
    } finally {
      setTailoring(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) return alert("Please paste a job description");

    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/resumes/${resumeId}/cover-letter`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!res.ok) throw new Error("Failed");
      const { coverLetter } = await res.json();
      setCoverLetter(coverLetter);
    } catch {
      alert("Failed to generate cover letter");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    alert("Copied!");
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading resume...</p>
          <p className="text-xs text-gray-400 mt-2">Resume ID: {resumeId}</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-red-800 font-semibold mb-2">Error Loading Resume</p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <p className="text-xs text-gray-600">Resume ID: {resumeId}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => loadResume()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Resume not found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              Edit Resume
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
                <DownloadButton snapshot={resume.data} />
              </div>
              <div className="h-[75vh] bg-gray-50 rounded-lg overflow-hidden">
                <MemoizedPDFPreview data={resume.data} />
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Save as &quot;FirstName_LastName_Resume.pdf&quot;</li>
                <li>• Keep resume under 2 pages</li>
                <li>• Remove tables/images for ATS</li>
                <li>• Always tailor for the job</li>
              </ul>
            </div>
          </section>

          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h2 className="text-lg font-semibold text-gray-900">Tailor for Job</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Paste job description here..."
              />
              <button
                onClick={handleTailorResume}
                disabled={tailoring || !jobDescription.trim()}
                className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {tailoring ? "Tailoring..." : "Tailor Resume"}
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📝</span>
                <h2 className="text-lg font-semibold text-gray-900">Cover Letter</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Generate a professional cover letter instantly.
              </p>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={generating || !jobDescription.trim()}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {generating ? "Generating..." : "Generate Cover Letter"}
              </button>

              {coverLetter && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold mb-3">Your Cover Letter</h3>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto text-sm whitespace-pre-wrap">
                    {coverLetter}
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button onClick={handleCopyCoverLetter} className="flex-1 py-2 bg-gray-200 rounded-lg">
                      Copy
                    </button>
                    <button onClick={handleDownloadCoverLetter} className="flex-1 py-2 bg-green-600 text-white rounded-lg">
                      Download
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