"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { generatePreview } from "@/db/client/documents";

// Dynamically import react-pdf components to prevent SSR issues
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  { ssr: false }
);
const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

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
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fitToWidth, setFitToWidth] = useState(true);
  const [pageWidth, setPageWidth] = useState<number | null>(null);

  const updateWidth = () => {
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth - 24;
    setPageWidth(w > 0 ? w : 0);
  };

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
        <p className="text-[oklch(0.7_0.2_30)]">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[oklch(0.25_0_0)] shadow-(--shadow-m) rounded-xl p-3">
      <div className="flex items-center flex-col gap-4 max-h-[calc(100vh-8rem)]">
        <div ref={containerRef} className="w-full flex flex-col gap-3">
          {/* Zoom controls */}
          <div className="sticky top-0 left-0 z-20 flex items-center gap-3 justify-center p-2 rounded-full bg-[oklch(0.3_0_0)]">
            <button
              aria-label="Zoom out"
              onClick={() => {
                setFitToWidth(false);
                setScale((s) => Math.max(0.2, +(s - 0.1).toFixed(2)));
              }}
              className="px-3 py-1 bg-[oklch(0.6_0_270)] text-white rounded disabled:opacity-50"
            >
              −
            </button>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.2}
                max={3}
                step={0.05}
                value={scale}
                onChange={(e) => {
                  setFitToWidth(false);
                  setScale(Number(e.target.value));
                }}
                className="w-56"
                aria-label="Zoom level"
              />
              <span className="w-16 text-center">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <button
              aria-label="Zoom in"
              onClick={() => {
                setFitToWidth(false);
                setScale((s) => Math.min(3, +(s + 0.1).toFixed(2)));
              }}
              className="px-3 py-1 bg-[oklch(0.6_0_270)] text-white rounded disabled:opacity-50"
            >
              +
            </button>

            <button
              aria-label="Fit to width"
              onClick={() => {
                setFitToWidth(true);
                requestAnimationFrame(updateWidth);
                setScale(1);
              }}
              className={`px-3 py-1 ml-2 rounded ${
                fitToWidth
                  ? "bg-[oklch(0.45_0.05_270)] text-white"
                  : "bg-[oklch(0.45_0.15_270)] text-white"
              }`}
            >
              Fit
            </button>
          </div>

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
            {Array.from(new Array(numPages), (_, index) => {
              const pageProps =
                fitToWidth && pageWidth ? { width: pageWidth } : { scale };
              return (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  {...pageProps}
                  className="mb-4"
                />
              );
            })}
          </Document>
        </div>
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
