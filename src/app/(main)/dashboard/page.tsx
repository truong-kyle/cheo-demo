
import DashboardClient from "@/components/ui/DashboardClient";
import { getUserUploadedDocuments } from "@/db/server/user";


export default async function DashboardPage() {
  const uploadedDocuments = await getUserUploadedDocuments();

  return (
    <DashboardClient uploadedDocuments={{ data: uploadedDocuments?.data ?? [] }} />
  );
}