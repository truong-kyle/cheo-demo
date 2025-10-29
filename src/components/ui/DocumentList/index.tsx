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

  return (
    <div className="shrink-0 flex flex-col h-full p-4 bg-[oklch(0.25_0_0)] rounded-xl shadow-(--shadow-m)">
      <div className={`flex flex-col items-center w-full ${uploadedDocuments.data.length === 0 && "h-full"}`}>
        <h1 className="text-xl font-bold select-none">Uploaded Documents</h1>
        <DragAndDrop length={uploadedDocuments.data.length} />
        <ul className="w-full">
          {uploadedDocuments.data?.map((doc, index) => (
            <motion.li
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
              key={`doc-${doc.file_id}`}
              onClick={() => onSelectFile(doc.file_id)}
              className={`relative w-full p-4 mb-2 rounded-lg hover:bg-[oklch(0.35_0_0)] cursor-pointer transition-colors group  ${
                selectedFileId === doc.file_id
                  ? "bg-[oklch(0.4_0_0)] ring-2 ring-[oklch(0.6_0_0)] shadow-(--shadow-l)"
                  : "bg-[oklch(0.3_0_0)] shadow-(--shadow-m)"
              }`}
            >
              <div className="flex justify-between w-full">
                <span className="pr-2 break-all text-left">
                  {doc.file_name}
                </span>
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
    </div>
  );
}
