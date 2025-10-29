"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { generatePreview } from "@/db/client/documents";

// Dynamically import react-pdf components to prevent SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(
  () => import("react-pdf").then((mod) => mod.Page),
  { ssr: false }
);

// Import pdfjs and configure worker only on client
let pdfjs: typeof import("react-pdf").pdfjs | null = null;
if (typeof window !== "undefined") {
  import("react-pdf").then((mod) => {
    pdfjs = mod.pdfjs;
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

interface DocumentViewerProps {
  file: string;
}

const DocumentViewer = ({ file }: DocumentViewerProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPreview = async () => {
      if (!file) {
        if (mounted) {
          setError("No file provided");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await generatePreview(file);
        
        if (!mounted) return;
        
        if (result.error) {
          setError(result.error.message ?? "Failed to generate preview");
          setLoading(false);
          return;
        }
        if (result.data?.signedUrl) {
          setPreviewUrl(result.data.signedUrl);
        } else {
          setError("No preview URL returned");
        }
        setLoading(false);
      } catch (err) {
        if (!mounted) return;
        setError((err as Error).message ?? "Unknown error");
        setLoading(false);
      }
    };

    loadPreview();

    return () => {
      mounted = false;
    };
  }, [file]);

   if (!previewUrl) {
    return (
       <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3 flex items-center flex-col justify-center select-none">
        <p className="text-gray-400">No document to display</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3 flex items-center flex-col justify-center">
        <p className="text-gray-400">Loading document...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="h-full overflow-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3 flex items-center flex-col justify-center">
        <p className="text-[oklch(0.7_0.15_0)]">Error: {error}</p>
      </div>
    );
  }

 

  return (
    <div className="h-full overflow-y-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3">
      <div className="flex items-center flex-col gap-4 max-h-[calc(100vh-8rem)]">
        <Document
          file={previewUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(error) => setError(error.message)}
          loading={
            <div className="flex items-center justify-center p-8">
              <p className="text-gray-400">Loading PDF...</p>
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={0.74}
              className="mb-4"
            />
          ))}
        </Document>
        {numPages > 0 && (
          <p className="fixed bottom-10 select-none text-center text-[oklch(0.2_0_0)] bg-[oklch(0.75_0_0)] rounded-full shadow-inner shadow-[oklch(0.2_0_0)] px-4 py-1 w-min whitespace-nowrap">
            {numPages} Page{numPages !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;
