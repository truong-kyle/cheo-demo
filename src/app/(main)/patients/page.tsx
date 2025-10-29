import PatientTable from "@/components/ui/PatientTable";
import { getPatients } from "@/db/server/medical";

export default async function PatientPage() {
  const { data: patients } = await getPatients()
    .then((res) => JSON.stringify(res))
    .then((str) => JSON.parse(str));

  console.log("Query result - Data:", patients);

  return (
    <div className="w-full h-full flex flex-col items-center text-[oklch(0.9_0_0)] gap-8 p-4">
      <h2>Total patients: {patients?.length ?? 0}</h2>
      {patients && patients.length > 0 ? (
        <PatientTable patients={patients} />
      ) : (
          <p>No patients found</p>
      )}
    </div>
  );
}
