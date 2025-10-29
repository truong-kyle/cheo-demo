import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans bg-[oklch(0.3_0.0_270)]">
      <Link href="/dashboard">
        <button className="flex hover:brightness-90 bg-[oklch(0.4_0.2_270)] p-5 rounded-xl shadow-(--shadow-md) text-white hover:shadow-(--shadow-l) active:translate-y-1 transition-all " >
          Go to Dashboard
        </button>
      </Link>
      
    </div>
  );
}
