"use client";
import { handleSignUp } from "@/db/client/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="w-full items-center flex h-screen justify-center flex-col bg-[oklch(0.2_0_0)]">
      <div className="flex w-xl flex-col shadow-inner shadow-[oklch(0.2_0_0)] bg-[oklch(0.8_0_0)] p-16 text-[oklch(0.2_0_0)] gap-2 rounded-xl">
        <div className="flex items-center align-middle w-full justify-between space-x-5">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={100}
            height={100}
            className=""
          />

          <div className="w-2/3 justify-center flex gap-4 flex-col">
          <h1 className="text-3xl text-center">Sign Up</h1>
            <form
              className="flex flex-col gap-4 "
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const { error } = await handleSignUp(e.currentTarget);
                if (error) {
                  setError(error.message ?? "Sign up failed");
                  return;
                } else {
                  toast.warning(
                    "Sign up successful! Check your email for verification link."
                  );
                  router.push("/login");
                }
              }}
            >
              <input
                name="first_name"
                type="text"
                placeholder="First Name"
                className="py-0.5 border-b border-b-[oklch(0.4_0_0)] focus:outline-none"
              />
              <input
                name="last_name"
                type="text"
                placeholder="Last Name"
                className="py-0.5 border-b border-b-[oklch(0.4_0_0)] focus:outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="py-0.5 border-b border-b-[oklch(0.4_0_0)] focus:outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="py-0.5 border-b border-b-[oklch(0.4_0_0)] focus:outline-none"
              />
              <button
                type="submit"
                className="w-min whitespace-nowrap text-[oklch(0.95_0_0)] rounded-sm px-5 py-1 bg-[oklch(0.5_0.4_180)] hover:bg-[oklch(0.4_0.4_180)] self-end cursor-pointer transition-all shadow-(--shadow-s)"
              >
                Sign Up
              </button>
              {error && <p className="text-[oklch(0.7_0.2_30)]">{error}</p>}
            </form>
            <span className="text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[oklch(0.5_0.2_270)] hover:text-[oklch(0.45_0.2_270)]">
                Log In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
