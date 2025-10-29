import { getPatientById } from "@/db/server/medical";
import { getDocumentsByPatientId, generatePreview } from "@/db/server/documents";
import Link from "next/link";
import DocumentTable from "@/components/ui/DocumentTable";

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: patientData } = await getPatientById(Number(id));
  const { data: documents } = await getDocumentsByPatientId(0);
  const currentDate = new Date().getTime();
  return (
    <div className="flex w-full min-h-screen items-center justify-center flex-col bg-slate-800">
      <Link href="/patients" className="self-start p-4 text-white underline">← Back to Patients</Link>
      <h1>ID: {id}</h1>
      <p>First Name: {patientData.first_name}</p>
      <p>Last Name: {patientData.last_name}</p>
      <p>Date of Birth: {patientData.dob} ({Math.floor((currentDate - new Date(patientData.dob).getTime()) / (1000 * 60 * 60 * 24 * 365))} Years Old)</p>
      <Link href={`mailto:${patientData.email}`}>Email: {patientData.email || "N/A"}</Link>
      <Link href={`tel:${patientData.phone}`}>Phone: {patientData.phone || "N/A"}</Link>
      <h2>Uploaded Documents</h2>
      {documents && documents.length > 0 ? (
        <DocumentTable documents={documents} />
      ) : (
        <p>No documents found for this patient.</p>
      )}
    </div>
  );
}
