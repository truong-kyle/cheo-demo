import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getDocumentInfo = async (fileId: string) => {
  return await supabase.from("scanned_docs").select("*").eq("file_id", fileId);
};

export const generatePreview = async (fileId: string) => {
  return await supabase.storage
    .from("scanned-docs")
    .createSignedUrl(`${fileId}.pdf`, 600);
};

export const getDocumentData = async (fileId: string) => {
  return await supabase
    .from("scanned_docs")
    .select("data, file_name, status")
    .eq("file_id", fileId);
};

export const updateDocumentData = async (
  fileId: string,
  results: JSON
) => {
  return await supabase
    .from("scanned_docs")
    .update({data: results, status: "verified"})
    .eq("file_id", fileId);
};
