"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ContentAdmin() {
  // STARTS CLOSED - as you wanted
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(d => {
      console.log("STATS", d);
      setStats(d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white pb-24">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0B0B0F] border-b border-[#1E1E28]">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-[#1E1E28] flex items-center justify-center text-white">☰</button>
          <span className="font-bold text-[16px]">Matric360</span>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-[#1E1E28] text-[12px]">🛡️ Content</span>
          <span className="px-3 py-1 rounded-full bg-[#1E1E28] text-[12px] text-green-400">Online</span>
        </div>
      </div>

      {/* WHEN MENU OPEN - show this, as in your green circle screenshot */}
      {menuOpen && (
        <>
          <div className="m-4 p-4 rounded-2xl bg-[#121A14] border border-green-900/50 flex justify-between items-start">
            <p className="text-[13px] text-gray-400 pr-4"><span className="text-green-400 font-bold">Content Admin mode</span> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.</p>
            <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full bg-[#1E1E28] flex-shrink-0">✕</button>
          </div>

          <div className="mx-4 bg-[#14141B] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-gray-300 py-2">⊞ Dashboard</div>
            <div className="mt-4 font-semibold">📄 Content ▾</div>
            <div className="ml-6 mt-3 space-y-4 text-gray-400 text-[14px] border-l border-[#1E1E28] pl-4">
              <div>Lesson Manager</div><div>Live Lessons</div><div>⚡ Review Lessons</div><div>🧬 Content Health</div><div>🧹 Content Cleanup</div><div>Content Coverage</div><div>Announcements</div>
            </div>
            <div className="mt-6 font-semibold">📖 Knowledge Base ▾</div>
            <div className="mt-6">🎥 Videos</div>
            <div className="mt-6 font-semibold">📋 Exam Hub ▾</div>
            <div className="mt-6 font-semibold">🛠️ Generation Tools ▾</div>
            <div className="ml-6 mt-3 space-y-3">
              <div className="bg-[#8B8CFF] text-black rounded-full px-4 py-2 font-bold w-fit">Factory</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Direct Generate</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Curriculum AI</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Upgrade Lessons</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Content Repair</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Math Regen</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Math Batch</div>
              <div className="text-gray-400 text-[14px] px-4 py-1">Publishing Queue</div>
            </div>
            <div className="mt-6">☠️ Beta & QA</div>
            <div className="mt-4">👥 Users</div>
          </div>
        </>
      )}

      {/* MAIN DASHBOARD - This is what you see FIRST when you land (your 1st screenshot) */}
      <div className="px-4 mt-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[22px] font-bold leading-tight">CAPS Content Factory</h1>
            <p className="text-[13px] text-gray-400 mt-1">Command center for Grade 12 curriculum production.</p>
          </div>
          <button className="bg-[#8B8CFF] text-black px-4 py-3 rounded-2xl text-[13px] font-bold leading-tight">Open Content<br/>Studio</button>
        </div>

        {/* NEAT BOXES - exactly like screenshot */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-[#8B8CFF]">📖</div>
            <p className="text-[13px] text-gray-400 mt-2">Total topics</p>
            <p className="text-[32px] font-bold mt-1">{loading? "..." : (stats?.total?? 0)}</p>
          </div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-green-400">✔️</div>
            <p className="text-[13px] text-gray-400 mt-2">Published</p>
            <p className="text-[32px] font-bold mt-1">{loading? "..." : (stats?.published?? 0)}</p>
          </div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-yellow-400">🕒</div>
            <p className="text-[13px] text-gray-400 mt-2">In review</p>
            <p className="text-[32px] font-bold mt-1">{loading? "..." : (stats?.inReview?? 0)}</p>
          </div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-gray-400">≡</div>
            <p className="text-[13px] text-gray-400 mt-2">Drafts</p>
            <p className="text-[32px] font-bold mt-1">0</p>
          </div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-red-400">⚠️</div>
            <p className="text-[13px] text-gray-400 mt-2">Needs changes</p>
            <p className="text-[32px] font-bold mt-1">0</p>
          </div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]">
            <div className="text-yellow-400">✨</div>
            <p className="text-[13px] text-gray-400 mt-2">Missing CAPS meta</p>
            <p className="text-[32px] font-bold mt-1">{loading? "..." : (stats?.missingMeta?? 0)}</p>
          </div>
        </div>

        <h2 className="mt-8 font-bold">Missing content</h2>
        <div className="mt-3 space-y-3">
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]"><p className="text-[13px] text-gray-400">Topics missing nodes A–E</p><p className="text-[28px] font-bold text-red-400 mt-1">{loading? "..." : (stats?.missingNodes?? 0)}</p></div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]"><p className="text-[13px] text-gray-400">Topics with &lt;3 questions</p><p className="text-[28px] font-bold text-red-400 mt-1">{loading? "..." : (stats?.lessThan3?? 0)}</p></div>
          <div className="bg-[#17171F] rounded-3xl p-5 border border-[#1E1E28]"><p className="text-[13px] text-gray-400">Topics missing paper/section</p><p className="text-[28px] font-bold text-red-400 mt-1">{loading? "..." : (stats?.missingPaper?? 0)}</p></div>
        </div>

        <h2 className="mt-8 font-bold">Completion by subject</h2>
        <div className="bg-[#17171F] rounded-3xl border border-[#1E1E28] mt-3 overflow-hidden">
          <div className="grid grid-cols-4 text-[10px] text-gray-500 p-4 uppercase"><span>Subject</span><span>Topics</span><span>Scaffolded</span><span>≥3 Qs</span></div>
          <div className="border-t border-[#1E1E28] grid grid-cols-4 p-4 text-[14px]"><span className="font-bold">Mathematics</span><span className="text-center">{stats?.bySubject?.Mathematics?.topics?? 0}</span><span className="text-center">{stats?.bySubject?.Mathematics?.scaffolded?? 0}</span><span className="text-center">{stats?.bySubject?.Mathematics?.qs?? 0}</span></div>
          <div className="border-t border-[#1E1E28] grid grid-cols-4 p-4 text-[14px]"><span className="font-bold">Physical Sciences</span><span className="text-center">{stats?.bySubject?.["Physical Sciences"]?.topics?? 0}</span><span className="text-center">{stats?.bySubject?.["Physical Sciences"]?.scaffolded?? 0}</span><span className="text-center">{stats?.bySubject?.["Physical Sciences"]?.qs?? 0}</span></div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#14141B] border-t border-[#1E1E28] flex justify-around py-3 text-[10px] text-gray-500">
        <span>🏠 Dashboard</span><span>📖 Subjects</span><span>📋 Exams</span><span>📊 Progress</span><span>👤 Profile</span>
      </div>
    </div>
  );
}
