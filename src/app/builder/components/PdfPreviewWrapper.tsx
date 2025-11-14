/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PDFViewer } from "@react-pdf/renderer";
import MyResumePDF from "../preview/Template1";
import { useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import React from "react";

interface PDFPreviewWrapperProps {
  data: Record<string, any>;
}

// Error Boundary Component
class PDFErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PDF Rendering Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center text-red-500 text-sm p-4">
          <div className="text-center">
            <p className="font-semibold mb-2">Error rendering PDF</p>
            <p className="text-xs text-gray-600">
              {this.state.error?.message || "Unknown error"}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function PDFPreviewWrapper({ data }: PDFPreviewWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Initializing PDF renderer...
      </div>
    );
  }

  return (
    <PDFErrorBoundary>
      <PDFViewer
        style={{ width: "100%", height: "100%", border: "none" }}
        showToolbar={false}
      >
        <MyResumePDF data={data} />
      </PDFViewer>
    </PDFErrorBoundary>
  );
}

export default React.memo(PDFPreviewWrapper, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});
