/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import MyResumePDF from "../preview/Template1";

interface DownloadButtonProps {
  snapshot: Record<string, any>;
}

export default function DownloadButton({ snapshot }: DownloadButtonProps) {
  // Extract the actual resume data - handle both cases
  const resumeData = snapshot?.data || snapshot;
  
  return (
    <PDFDownloadLink
      document={<MyResumePDF data={resumeData} />}
      fileName={`${resumeData?.fullName?.trim() || "Resume"}.pdf`}
      className="flex-1 px-4 py-2 border border-gray-300 rounded text-center text-gray-700 hover:bg-gray-50 transition"
    >
      {({ loading }) => (loading ? "Generating…" : "Export PDF")}
    </PDFDownloadLink>
  );
}