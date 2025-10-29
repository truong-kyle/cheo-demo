"use client";
import {
  Upload,
  FilePen,
  CircleCheckBig,
  Plus,
  UploadCloud,
} from "lucide-react";
import { useState } from "react";
import { uploadFile } from "@/db/client/upload";
import DragAndDrop from "@/components/ui/DragAndDrop";
import { toast } from "sonner";
import { motion } from "motion/react";

interface DocumentListProps {
  uploadedDocuments: {
    data: Array<{
      id: string;
      file_id: string;
      file_name: string;
      status: string;
      created_at: string;
    }>;
  };
  selectedFileId: string;
  onSelectFile: (fileId: string) => void;
}

export default function DocumentList({
  uploadedDocuments,
  selectedFileId,
  onSelectFile,
}: DocumentListProps) {
  enum UploadedDocumentStatus {
    UPLOADED = "uploaded",
    PROCESSED = "processed",
    VERIFIED = "verified",
  }

  const [data, setData] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File | null) => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setUploading(true);
    setError(null);


    try {
      const result = await uploadFile(file);

      if (result.error) {
        setError(result.error.message ?? "Upload failed");
        setUploading(false);
        return;
      }

      // Success - reset state and refresh page to show new document
      toast.success("Upload successful!");
      setData(null);
      setError(null);
      setUploading(false);

      // Refresh the page to show the newly uploaded document
      window.location.reload();
    } catch (err) {
      console.error("Upload exception:", err);
      setError((err as Error).message ?? "Upload failed");
      setUploading(false);
    }
  };

  return (
    <div className="shrink-0 flex flex-col h-full p-4 bg-[oklch(0.25_0_0)] rounded-xl shadow-(--shadow-m)">
      <div className="flex flex-col mb-2 items-center w-full">
        <h1 className="text-xl font-bold select-none">Uploaded Documents</h1>
        {uploadedDocuments.data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex justify-end"
          >
            <div className={`${data ? "bg-[oklch(0.9_0_0)]" : "bg-[oklch(0.7_0_0)]"} transition-colors flex flex-col items-end gap-2  p-2 rounded-md w-full text-[oklch(0.3_0_270)] shadow-inner shadow-[oklch(0.2_0_0)]`}>
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
              {error && (
                <p className="text-[oklch(0.7_0.2_30)] text-xs">{error}</p>
              )}
              </>
              
            ) : (
              <label
                htmlFor="file-upload"
                className="cursor-pointer hover:text-[oklch(0.2_0_0)] transition-colors self-end"
              >
                <Plus />
              </label>
            )}
            </div>
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
      {uploadedDocuments.data.length === 0 && <DragAndDrop />}
      <ul>
        {uploadedDocuments.data?.map((doc, index) => (
          <motion.li
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
            key={`doc-${doc.file_id}`}
            onClick={() => onSelectFile(doc.file_id)}
            className={`relative w-full p-4 mb-2 rounded-lg hover:bg-[oklch(0.35_0_0)] cursor-pointer transition-colors group  ${
              selectedFileId === doc.file_id
                ? "bg-[oklch(0.4_0_0)] ring-2 ring-[oklch(0.6_0_0)] shadow-(--shadow-l)"
                : "bg-[oklch(0.3_0_0)] shadow-(--shadow-m)"
            }`}
          >
            <div className="flex justify-between w-full">
              <span className="pr-2 break-all text-left">{doc.file_name}</span>
              <span>
                {doc.status === UploadedDocumentStatus.UPLOADED ? (
                  <Upload className="inline-block ml-2 text-blue-500" />
                ) : doc.status === UploadedDocumentStatus.PROCESSED ? (
                  <FilePen className="inline-block ml-2 text-yellow-500" />
                ) : doc.status === UploadedDocumentStatus.VERIFIED ? (
                  <CircleCheckBig className="inline-block ml-2 text-green-500" />
                ) : null}
              </span>
            </div>
            <p className="text-sm text-[oklch(0.7_0_0)] whitespace-nowrap">
              {new Date(doc.created_at).toLocaleString()}
            </p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
