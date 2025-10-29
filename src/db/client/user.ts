import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const handleSignOut = async () => {
 return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return await supabase.auth.getSession();
};

export const handleSignUp = async (form: HTMLFormElement) => {
  const formData = new FormData(form);
  return await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
      },
    },
  });
};

export const handleSignIn = async (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};
