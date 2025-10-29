"use client";

import { handleSignIn } from "@/db/client/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginForm() {
  const currentDate = new Date().getTime();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="w-full items-center flex h-screen justify-center flex-col bg-[oklch(0.2_0_0)]">
      <div className="flex w-xl flex-col shadow-inner shadow-[oklch(0.2_0_0)] bg-[oklch(0.8_0_0)] p-16 text-[oklch(0.2_0_0)] gap-2 rounded-xl border-gray-500">
        <div className="flex items-center align-middle w-full justify-between space-x-5">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={100}
            height={100}
            className=""
          />

          <div className="w-2/3 justify-center flex gap-4 flex-col">
            <h1 className="text-3xl text-center">Log In</h1>
            <form
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const { error: signInError } = await handleSignIn(
                  e.currentTarget
                );
                if (signInError) {
                  setError(signInError.message ?? "Login failed");
                  return;
                }
                router.push("/dashboard");
              }}
              className="flex flex-col gap-4"
            >
              <input
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className="py-0.5 border-b border-b-gray-500/50 focus:outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                required
                className="py-0.5 border-b border-b-gray-500/50 focus:outline-none"
              />
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-min whitespace-nowrap text-[oklch(0.95_0_0)] rounded-sm px-5 shadow-(--shadow-s) py-1 bg-[oklch(0.5_0.2_270)] self-end cursor-pointer hover:bg-[oklch(0.45_0.2_270)] transition-all"
              >
                Log In
              </button>
            </form>

            <span className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[oklch(0.5_0.4_180)] hover:text-[oklch(0.4_0.4_180)] transition-all">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
