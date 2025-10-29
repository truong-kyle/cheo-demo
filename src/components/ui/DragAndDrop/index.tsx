"use client";
import { useState } from "react";
import { uploadFile } from "@/db/client/upload";
import { UploadCloud, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

interface DragAndDropProps {
  length: number;
}

export default function DragAndDrop({ length }: DragAndDropProps) {
  const [data, setData] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file?.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF.");
      return;
    }
    setError(null);
    setData(file);
  };

  const handleUpload = async (file: File | null) => {
    setUploading(true);
    setError(null);
    const result = await uploadFile(file);
    setUploading(false);
    if (result.error) {
      setError(result.error.message ?? "Upload failed");
    } else {
      setData(null);
      setError(null);
      toast.success("File sucessfully uploaded");
      window.location.reload();
    }
  };
  return (
    <div className="flex flex-col h-full justify-center w-full">
      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="shadow-inner rounded-lg text-center w-full h-full shadow-[oklch(0.4_0_0)] p-2 my-2 flex items-center bg-[oklch(0.7_0_270)] hover:bg-[oklch(0.75_0_270)] transition-all text-[oklch(0.1_0_270)]"
      >
        {length === 0 ? (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            <UploadCloud width={100} height={100} className={uploading ? "animate-pulse" : ""} />
            <span>
              {!data ? (
                <p>Drag & drop a PDF or click to select</p>
              ) : (
                <p className="break-all">
                  Selected: {data.name}
                  <br />
                  (click to change)
                </p>
              )}
            </span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
                if (file?.type !== "application/pdf") {
                  setError("Invalid file type. Please upload a PDF.");
                  return;
                }
                setData(file);
              }}
              className="hidden"
            />
          </label>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full flex justify-end"
          >
            {data ? (
              <>
                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="file-upload"
                    className="select-none cursor-pointer hover:text-[oklch(0.1_0_0)] transition-colors text-sm"
                  >
                    {data.name}
                  </label>
                  <button
                    onClick={() => handleUpload(data)}
                    disabled={uploading}
                    className={`cursor-pointer transition-colors font-bold ${
                      uploading
                        ? "text-[oklch(0.5_0_0)] cursor-not-allowed"
                        : "hover:text-[oklch(0.1_0_0)]"
                    }`}
                    title={uploading ? "Uploading..." : "Upload file"}
                  >
                    <UploadCloud className={uploading ? "animate-pulse" : ""} />
                  </button>
                </div>
              </>
            ) : (
              <label
                htmlFor="file-upload"
                className="cursor-pointer hover:text-[oklch(0.2_0_0)] transition-colors self-end"
              >
                <Plus />
              </label>
            )}

            <input
              type="file"
              id="file-upload"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setData(file);
                  setError(null);
                }
              }}
              className="hidden"
            />
          </motion.div>
        )}
      </div>
        {error && <p className="text-[oklch(0.7_0.2_30)] mb-2">{error}</p>}
      {length == 0 && (
        <>
          <button
            onClick={() => handleUpload(data)}
            disabled={!data || uploading}
            className="px-4 py-2 bg-[oklch(0.5_0.15_270)] text-white rounded-lg hover:bg-[oklch(0.45_0.2_270)] transition-all disabled:opacity-50 shadow-(--shadow-s)"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
}
