"use client";
import Link from "next/link";

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-[85%] max-w-[320px] bg-[#0f111a] h-full p-5 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Matric360" className="w-8 h-8 rounded-lg" />
            <span className="font-bold text-white text-[18px]">Matric360</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-[#2a2f45] flex items-center justify-center text-white">✕</button>
        </div>

        <nav className="flex-1 space-y-1">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>🏠</span> Dashboard</Link>
          <Link href="/subjects" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>📚</span> Subjects</Link>

          <div className="text-[11px] tracking-widest text-gray-500 mt-5 mb-2 px-3">SUBJECTS</div>
          <Link href="/maths" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-white bg-[#1a1e2e]"><span className="text-[#6c7bff]">Σ</span> Mathematics</Link>
          <Link href="/physics" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span className="text-[#6c7bff]">🎓</span> Physical Sciences</Link>

          <div className="h-[1px] bg-[#1e2336] my-4" />

          <Link href="/mock-exams" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>📋</span> Mock Exams</Link>
          <Link href="/live" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>📡</span> Live Lessons</Link>
          <Link href="/announcements" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>📢</span> Announcements</Link>
          <Link href="/progress" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>📊</span> Progress</Link>
          <Link href="/subscription" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>💳</span> Subscription</Link>
          <Link href="/how-to-use" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>❓</span> How to use Matric360</Link>
          <button onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 w-full"><span>⬇️</span> Install Matric360</button>
          <Link href="/profile" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>👤</span> Profile</Link>
          <Link href="/admin" onClick={onClose} className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-[#1a1e2e] hover:text-white"><span>🛡️</span> Content Admin</Link>

          <div className="h-[1px] bg-[#1e2336] my-4" />
          <button className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 w-full"><span>↪️</span> Logout</button>
        </nav>
      </div>
      {/* backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose}></div>
    </div>
  );
}
