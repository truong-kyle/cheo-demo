"use client";
import { useState } from "react";
import { uploadFile } from "@/db/client/upload";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner"

export default function DragAndDrop() {
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
      toast.success("File sucessfully uploaded")
      
      window.location.reload();
    }
  };
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <div
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        className="shadow-inner rounded-lg text-center cursor-pointer w-full shadow-[oklch(0.4_0_0)] p-4 flex items-center bg-[oklch(0.7_0_270)] hover:bg-[oklch(0.75_0_270)] transition-all text-[oklch(0.1_0_270)]"
      >
        <label className="cursor-pointer flex flex-col items-center justify-center w-full">
          <UploadCloud width={100} height={100} />
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
      </div>
      {error && <p className="text-[oklch(0.7_0.2_30)]">{error}</p>}
      <button
        onClick={() => handleUpload(data)}
        disabled={!data || uploading}
        className="px-4 py-2 bg-[oklch(0.5_0.15_270)] text-white rounded hover:bg-[oklch(0.45_0.2_270)] transition-all disabled:opacity-50 shadow-(--shadow-s)"
      >
        Upload
      </button>
    </div>
  );
}
