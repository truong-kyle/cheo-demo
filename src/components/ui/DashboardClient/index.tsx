"use client";
import { useState } from "react";
import DocumentViewer from "@/components/ui/DocumentViewer";
import DocumentList from "@/components/ui/DocumentList";
import DocumentEditor from "@/components/ui/DocumentEditor";

interface DashboardClientProps {
  uploadedDocuments: {
    data: Array<{
      id: string;
      file_id: string;
      file_name: string;
      status: string;
      created_at: string;
    }>;
  };
}

export default function DashboardClient({ uploadedDocuments }: DashboardClientProps) {
  const [selectedFileId, setSelectedFileId] = useState<string>(
    ""
  );

  return (
    <div className="w-full h-full grid grid-cols-8 bg-[oklch(0.2_0_0)] text-[oklch(0.9_0_0)] p-4 gap-4">
      <div className="col-span-2">

      <DocumentList 
        uploadedDocuments={uploadedDocuments} 
        selectedFileId={selectedFileId}
        onSelectFile={setSelectedFileId}
        />
        </div>
      <div className="col-span-4">
        <DocumentViewer file={selectedFileId} />
      </div>
      <div className="col-span-2">
        <DocumentEditor file={selectedFileId}/>
      </div>
    </div>
  );
}
