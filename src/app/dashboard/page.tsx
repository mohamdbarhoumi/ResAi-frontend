"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthGuard } from "../hooks/useAuthGuard";

interface Resume {
  id: string;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
  data?: {
    fullName?: string;
  };
}

export default function Dashboard() {
  useAuthGuard();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8081/api/resumes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(data || []);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleEdit = (resumeId: string) => {
    router.push(`/builder?id=${resumeId}`);
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8081/api/resumes/delete/${resumeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== resumeId));
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <Navbar title="Dashboard" />
      
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          My Resumes
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E88E5]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create New Resume Card */}
            <div
              onClick={() => router.push("/templates")}
              className="w-full h-72 bg-white shadow-lg rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl hover:border-[#1E88E5] transition"
            >
              <span className="text-[#1E88E5] text-7xl leading-none font-semibold">
                +
              </span>
              <p className="text-gray-600 font-medium mt-3">
                Create New Resume
              </p>
            </div>

            {/* Existing Resumes */}
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="w-full h-72 bg-white shadow-lg rounded-xl border border-gray-200 flex flex-col overflow-hidden hover:shadow-xl transition group"
              >
                {/* Preview Area */}
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#1E88E5] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">
                        {resume.data?.fullName?.[0]?.toUpperCase() || "R"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate px-2">
                      {resume.title || "Untitled Resume"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {resume.template || "Standard"}
                    </p>
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="p-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-3">
                    Updated {formatDate(resume.updated_at)}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(resume.id)}
                      className="flex-1 bg-[#1E88E5] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#1976D2] transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="bg-red-50 text-red-600 py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && resumes.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No resumes yet</p>
            <p className="text-sm">Click the + card to create your first resume</p>
          </div>
        )}
      </section>
    </main>
  );
}