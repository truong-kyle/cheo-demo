import DragAndDrop from "@/components/ui/Upload";
import DashboardClient from "@/components/ui/DashboardClient";
import { getUserUploadedDocuments } from "@/db/server/user";


export default async function DashboardPage() {
  const uploadedDocuments = await getUserUploadedDocuments();

  if (!uploadedDocuments || uploadedDocuments?.data?.length === 0) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center flex-col bg-[oklch(0.2_0_0)] text-white">
        <DragAndDrop />
      </div>
    );
  }

  return (
    <DashboardClient uploadedDocuments={{ data: uploadedDocuments?.data ?? [] }} />
  );
}