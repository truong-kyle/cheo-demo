import { createClient } from "@/utils/supabase/server";

export const createPatientRecord = async (
  name: string,
  age: number,
  dateOfBirth: string
) => {
  const supabase = await createClient();
  const { data: createData, error: createError } = await supabase
    .from("medical")
    .insert([{ name, age, date_of_birth: dateOfBirth }])
    .single();

  if (createError) {
    throw { error: createError };
  }

  return createData;
};

export const getPatients = async () => {
  const supabase = await createClient();
  return await supabase.from("medical").select("*");
};

export const getPatientId = async (userId: string) => {
  const supabase = await createClient();
  const { data: patientData, error: patientError } = await supabase
    .from("medical")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (patientError) {
    throw { error: patientError };
  }

  return patientData.id;
};

export const getPatientById = async (id: number) => {
  const supabase = await createClient();
  return await supabase.from("medical").select("*").eq("id", id).single();
};
