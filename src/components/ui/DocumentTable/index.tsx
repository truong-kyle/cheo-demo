import { generatePreview } from "@/db/server/documents";
import { File } from "lucide-react"
import Link from "next/link";

interface DocumentTableProps {
  documents: Array<{ file_name: string; created_at: string; file_id: string }>;
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  
      
          return (
            <table className="divide-y divide-gray-200 ">
                <thead>
                    <tr className="border">
                        <th className="px-6 py-2">File Name</th>
                        <th className="px-6 py-2">Created At</th>
                        <th className="px-6 py-2">Preview Link</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map(async (doc: { file_name: string; created_at: string; file_id: string }, index: number) => {
                      const preview = await generatePreview(doc.file_id);
                      return (
                        <tr key={doc.file_id ?? index} className="border">
                        <td className="px-6 py-2">{doc.file_name}</td>
                        <td className="px-6 py-2">{new Date(doc.created_at).toLocaleString()}</td>
                        <td className="text-center">
                            <Link
                                href={preview.data?.signedUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <File className="mr-2 inline" />
                            </Link>
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            );
}
