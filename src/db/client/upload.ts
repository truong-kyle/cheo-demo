import { getCurrentUser } from "./user";
import { createClient } from "@/utils/supabase/client";
import { generatePreview } from "./documents";

const supabase = createClient();

export const uploadFile = async (data: File | null) => {
  if (!data) {
    return { error: new Error("No file provided") };
  }

  console.log("uploadFile: Starting upload for", data.name);

  const uuid = crypto.randomUUID();
  console.log("uploadFile: Generated UUID", uuid);

  const { error: uploadError } = await supabase.storage
    .from("scanned-docs")
    .upload(`${uuid}.pdf`, data);

  if (uploadError) {
    console.error("uploadFile: Storage upload error", uploadError);
    return { error: uploadError };
  }

  console.log("uploadFile: File uploaded to storage successfully");

  const { data: urlData, error: urlError } = await generatePreview(uuid);
  if (urlError) {
    console.error("uploadFile: Preview generation error", urlError);
    return { error: urlError };
  }

  console.log("uploadFile: Preview generated successfully");

  // Pass null for patientId to allow it to be nullable in the database
  const { error: dbError } = await newDBEntry(uuid, data);
  if (dbError) {
    console.error("uploadFile: Database insert error", dbError);
    if (dbError.message.includes("duplicate key value")) {
      return { error: new Error("File already exists") };
    }
    if (dbError.message.includes("scanned_docs_patient_id_fkey")) {
      return { error: new Error("Cannot find patient") };
    }
    return { error: dbError };
  }

  console.log("uploadFile: Database entry created successfully");
  return { data: urlData };
};

export const newDBEntry = async (
  fileUrl: string,
  file: File
) => {
  return supabase
    .from("scanned_docs")
    .insert([
      {
        uploaded_by: await getCurrentUser().then((e) => e?.data.session?.user?.id ?? null),
        file_id: fileUrl,
        file_name: file.name,
        data: { first_name: "John", last_name: "Doe", dob: "1990-01-01", gender: "Male", document_type: "ID" },
      },
    ])
    .single();
};
