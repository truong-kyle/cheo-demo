import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface PatientTableProps {
  patients: Array<{
    id: number;
    first_name: string;
    last_name: string;
    dob: string;
  }>;
}

export default function PatientTable({ patients }: PatientTableProps) {
  const currentDate = new Date().getTime();
  return (
    <table className="w-full divide-y divide-gray-200 ">
      <thead>
        <tr className="border">
          <th>View</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Age</th>
          <th>Date of Birth</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
            
          <tr key={patient.id} className="border hover:bg-white/25">
            <td className="flex justify-center py-2">
              <Link href={`/patients/${patient.id}`}>
                <ExternalLink />
              </Link>
            </td>
            <td className="py-2">{patient.first_name}</td>
            <td className="py-2">{patient.last_name}</td>
            <td className="py-2">
              {Math.floor(
                (currentDate - new Date(patient.dob).getTime()) /
                  (1000 * 60 * 60 * 24 * 365)
              )}
            </td>
            <td className="py-2">{patient.dob}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
