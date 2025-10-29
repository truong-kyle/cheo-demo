"use client";
import { handleSignOut } from "@/db/client/user";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, CircleUserRound } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
interface NavbarProps {
  user: string;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname().split("/");
  const [navMenu, openNavMenu] = useState(false);
  const [profileMenu, openProfileMenu] = useState(false);

  return (
    <nav className="rounded-xl mt-2 w-[calc(100%-2rem)] self-center flex min-h-16 align-middle items-center justify-between px-10 bg-[oklch(0.23_0_0)] text-[oklch(0.9_0_0)] shadow-(--shadow-s)">
      <Image
        src="/logo-white.webp"
        alt="Logo"
        width={50}
        height={50}
        className="flex object-contain"
      />
      <div className="relative flex justify-center">
        <button
          className={`flex space-x-1 py-2 px-10 items-center  rounded-full transition-all duration-200 shadow-(--shadow-s) ${
            navMenu
              ? "bg-[oklch(0.3_0_0)] hover:bg-[oklch(0.25_0_0)]"
              : "bg-[oklch(0.4_0_0)] hover:bg-[oklch(0.35_0_0)]"
          }`}
          onClick={() => {
            openNavMenu(!navMenu);
            openProfileMenu(false);
          }}
        >
          {pathname.length > 2 && (
            <h1 className="text-2xl">
              {pathname[2].includes("new")
                ? "Create New"
                : pathname[2][0].toUpperCase() + pathname[2].slice(1)}{" "}
              &#x2022;{" "}
            </h1>
          )}
          <h1 className="text-2xl">
            {pathname[1][0].toUpperCase() + pathname[1].slice(1)}
          </h1>
          <ChevronDown />
        </button>
        <AnimatePresence>
          {navMenu && (
            <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[120%] p-4 z-50 w-50 bg-[oklch(0.9_0_0)] text-black rounded-lg shadow-(--shadow-s)">
              <ul className="flex flex-col">
                <Link
                  href="/dashboard"
                  className="px-7 py-2 hover:bg-[oklch(0.8_0_0)] transition-all rounded-lg cursor-pointer"
                >
                  Dashboard
                </Link>

               
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative flex justify-center">
        <button
          className={`flex space-x-5 items-center  shadow-inner shadow-[oklch(0_0_0)] hover:shadow-[oklch(0.2_0_0)] py-3 px-5 rounded-full  transition-all duration-200 ${
            profileMenu
              ? "bg-[oklch(0.4_0_0)] hover:bg-[oklch(0.45_0_0)]"
              : "bg-[oklch(0.5_0_0)] hover:bg-[oklch(0.55_0_0)]"
          }`}
          onClick={() => {
            openProfileMenu(!profileMenu);
            openNavMenu(false);
          }}
        >
          <CircleUserRound />
          <h1>{user ?? "User"}</h1>
        </button>
        <AnimatePresence>

        {profileMenu && (
          <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-[120%] z-10 flex flex-col items-center p-4 bg-[oklch(0.9_0_0)] text-black rounded-lg">
            <button
              onClick={async () => {
                const { error } = await handleSignOut();
                if (error) {
                  toast.error("Error signing out: " + error.message);
                }
                toast.success("Signed out successfully");
                redirect("/login");
              }}
              className="w-full min-w-32 px-2 py-2 hover:bg-[oklch(0.8_0_0)] transition-colors rounded-lg cursor-pointer"
            >
              Sign Out
            </button>
            {/* <Link
              href="/settings"
              className="px-2 py-2 whitespace-nowrap hover:bg-[oklch(0.8_0_0)] transition-all rounded-lg"
              >
              Account Settings
            </Link> */}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
