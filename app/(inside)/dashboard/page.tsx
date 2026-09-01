"use client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onClick={()=>router.push("/subjects/mathematics")} className="p-6 rounded-2xl bg-black text-white cursor-pointer">
          <h2 className="text-xl font-bold">Mathematics</h2>
          <p className="text-sm opacity-70">Tap to open Units → Topics → Nodes A-E + YouTube</p>
        </div>
        <div onClick={()=>router.push("/subjects/physical-sciences")} className="p-6 rounded-2xl bg-zinc-900 text-white cursor-pointer">
          <h2 className="text-xl font-bold">Physical Sciences</h2>
          <p className="text-sm opacity-70">Tap to open Units → Topics → Nodes A-E + YouTube</p>
        </div>
      </div>
    </div>
  );
}
