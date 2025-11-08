"use client";

import { ChangeEvent } from "react";
import { useResumeStore } from "../store/resumeStore";
import { Plus, Trash2 } from "lucide-react";

export default function StepCertificates() {
  const certificates = useResumeStore((s) => s.certificates);
  const addCertificate = useResumeStore((s) => s.addCertificate);
  const updateCertificate = useResumeStore((s) => s.updateCertificate);
  const removeCertificate = useResumeStore((s) => s.removeCertificate);

  const onChange =
    (id: string, key: string) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      updateCertificate(id, { [key]: e.target.value });
    };

  const handleAddCertificate = () => {
    addCertificate({ name: "", issuer: "", date: "" });
  };

  return (
    <div className="space-y-6">
      {certificates.map((cert) => (
        <div key={cert.id} className="border rounded-lg p-4 space-y-4 relative">
          {/* Remove Certificate Button */}
          <button
            onClick={() => removeCertificate(cert.id)}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
            title="Remove Certificate"
          >
            <Trash2 size={18} />
          </button>

          <div>
            <label className="text-sm text-gray-600">Certificate Name</label>
            <input
              value={cert.name}
              onChange={onChange(cert.id, "name")}
              placeholder="e.g., AWS Certified Solutions Architect"
              className="input mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600">Issuer</label>
              <input
                value={cert.issuer}
                onChange={onChange(cert.id, "issuer")}
                placeholder="e.g., Amazon Web Services"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                value={cert.date}
                onChange={onChange(cert.id, "date")}
                placeholder="e.g., Jun 2024"
                className="input mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddCertificate}
        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Certificate
      </button>
    </div>
  );
}
