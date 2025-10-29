import { createClient as createServer } from "@/utils/supabase/server";

export const getCurrentUser = async () => {
  const serverSupabase = await createServer();
  return await serverSupabase.auth.getUser();
};

export const getUserUploadedDocuments = async () => {
  const {data: { user }} = await getCurrentUser();
  const userId = user?.id;
  const serverSupabase = await createServer();
  return await serverSupabase.from("scanned_docs").select("*").eq("uploaded_by", userId).order("created_at", { ascending: false });
};