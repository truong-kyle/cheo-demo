import { createClient } from "@/utils/supabase/server";

export const getDocumentsByPatientId = async (id: number) => {
  const supabase = await createClient();
  return await supabase
    .from("scanned_docs")
    .select("file_name, created_at, file_id")
    .eq("patient_id", id);
};

export const generatePreview = async (fileId: string) => {
  const supabase = await createClient();
  return await supabase.storage
    .from("scanned-docs")
    .createSignedUrl(`${fileId}.pdf`, 600);
};
