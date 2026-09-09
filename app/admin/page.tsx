"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ContentAdmin() {
  const [menuOpen, setMenuOpen] = useState(true);
  const [contentOpen, setContentOpen] = useState(true);
  const [kbOpen, setKbOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(d => {
      setStats(d);
      setLoading(false);
    });
  }, []);

  const Card = ({ icon, label, value, color = "white" }: any) => (
    <div className="bg-[#1C1C22] rounded-[24px] p-5 border border-[#2A2A32]">
      <div className="text-[20px] mb-2">{icon}</div>
      <p className="text-[14px] text-[#8A8A96]">{label}</p>
      <p className={`text-[32px] font-bold mt-1 ${color === 'red'? 'text-[#FF3B3B]' : 'text-white'}`}>{loading? "..." : value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0F12] text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1C1C22]">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-[#1C1C22] flex items-center justify-center">☰</button>
          <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-blue-600"></div><span className="font-bold">Matric360</span></div>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-[#1C1C22] text-[13px] border border-[#2A2A32]">🛡️ Content</span>
          <span className="px-3 py-1 rounded-full bg-[#1C1C22] text-[13px] text-green-400 border border-[#2A2A32]">🛜 Online</span>
        </div>
      </div>

      {/* Content Admin mode banner */}
      {menuOpen && (
        <div className="m-4 p-4 rounded-[20px] bg-[#16201A] border border-[#2A4A32] flex justify-between">
          <p className="text-[14px] text-[#8A8A96]"><span className="text-green-400 font-bold">Content Admin mode</span> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.</p>
          <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-full bg-[#1C1C22] flex items-center justify-center">✕</button>
        </div>
      )}

      {/* Menu Panel - Order exactly as you showed */}
      {menuOpen && (
        <div className="mx-4 bg-[#15151A] rounded-[24px] p-4 border border-[#1C1C22]">
          <div className="py-2 flex gap-3 text-[#E0E0E8]">⊞ Dashboard</div>

          <div className="mt-3">
            <div onClick={() => setContentOpen(!contentOpen)} className="flex justify-between py-2 cursor-pointer font-bold">📄 Content <span>{contentOpen? '⌄' : '›'}</span></div>
            {contentOpen && <div className="ml-4 border-l border-[#2A2A32] pl-4 space-y-3 text-[#8A8A96] text-[15px] mt-2">
              <div>Lesson Manager</div><div>Live Lessons</div><div>⚡ Review Lessons</div><div>🩺 Content Health</div><div>🧹 Content Cleanup</div><div>Content Coverage</div><div>Announcements</div>
            </div>}
          </div>

          <div className="mt-4">
            <div onClick={() => setKbOpen(!kbOpen)} className="flex justify-between py-2 cursor-pointer font-bold">📖 Knowledge Base <span>{kbOpen? '⌄' : '›'}</span></div>
            {kbOpen && <div className="ml-4 border-l border-[#2A2A32] pl-4 space-y-3 text-[#8A8A96] mt-2"><div>Knowledge Base</div><div>CAPS KB</div><div>Source PDFs</div><div>KB Coverage</div></div>}
          </div>

          <div className="py-2 mt-2 flex gap-3">🎥 Videos</div>

          <div className="mt-2">
            <div onClick={() => setExamOpen(!examOpen)} className="flex justify-between py-2 cursor-pointer font-bold">📋 Exam Hub <span>{examOpen? '⌄' : '›'}</span></div>
            {examOpen && <div className="ml-4 border-l border-[#2A2A32] pl-4 space-y-3 text-[#8A8A96] mt-2"><div>Questions</div><div>Question Bank Audit</div><div>Question Coverage</div></div>}
          </div>

          <div className="mt-4">
            <div onClick={() => setGenOpen(!genOpen)} className="flex justify-between py-2 cursor-pointer font-bold">🛠️ Generation Tools <span>{genOpen? '⌄' : '›'}</span></div>
            {genOpen && <div className="ml-4 border-l border-[#2A2A32] pl-2 space-y-2 mt-2">
              <div className="bg-[#7B7CFF] text-black rounded-full px-4 py-2 font-medium">Factory</div>
              <div className="px-4 py-2 text-[#8A8A96]">Direct Generate</div>
              <div className="px-4 py-2 text-[#8A8A96]">Curriculum AI</div>
              <div className="px-4 py-2 text-[#8A8A96]">Upgrade Lessons</div>
              <div className="px-4 py-2 text-[#8A8A96]">Content Repair</div>
              <div className="px-4 py-2 text-[#8A8A96]">Math Regen</div>
              <div className="px-4 py-2 text-[#8A8A96]">Math Batch</div>
              <div className="px-4 py-2 text-[#8A8A96]">Publishing Queue</div>
            </div>}
          </div>

          <div className="mt-4 py-2 flex justify-between">☠️ Beta & QA <span>›</span></div>
          <div className="py-2 flex gap-2">👥 Users</div>
        </div>
      )}

      {/* CAPS Content Factory */}
      <div className="p-4 mt-4">
        <div className="flex justify-between items-start">
          <div><h1 className="text-[24px] font-bold">CAPS Content Factory</h1><p className="text-[14px] text-[#8A8A96]">Command center for Grade 12 curriculum production.</p></div>
          <Link href="/admin/studio"><button className="bg-[#7B7CFF] text-black px-4 py-3 rounded-[16px] text-[14px] font-bold">Open Content Studio</button></Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <Card icon="📖" label="Total topics" value={stats?.total} />
          <Card icon="✅" label="Published" value={stats?.published} />
          <Card icon="🕒" label="In review" value={stats?.inReview} />
          <Card icon="☰" label="Drafts" value={stats?.drafts} />
          <Card icon="❗" label="Needs changes" value={stats?.needsChanges} />
          <Card icon="✨" label="Missing CAPS meta" value={stats?.missingMeta} />
        </div>

        <h2 className="mt-6 font-bold text-[18px]">Missing content</h2>
        <div className="space-y-3 mt-3">
          <div className="bg-[#1C1C22] rounded-[24px] p-5 border border-[#2A2A32]"><p className="text-[#8A8A96] text-[14px]">Topics missing nodes A–E</p><p className="text-[#FF3B3B] text-[28px] font-bold">{loading? "..." : stats?.missingNodes}</p></div>
          <div className="bg-[#1C1C22] rounded-[24px] p-5 border border-[#2A2A32]"><p className="text-[#8A8A96] text-[14px]">Topics with &lt;3 questions</p><p className="text-[#FF3B3B] text-[28px] font-bold">{loading? "..." : stats?.lessThan3}</p></div>
          <div className="bg-[#1C1C22] rounded-[24px] p-5 border border-[#2A2A32]"><p className="text-[#8A8A96] text-[14px]">Topics missing paper/section</p><p className="text-[#FF3B3B] text-[28px] font-bold">{loading? "..." : stats?.missingPaper}</p></div>
        </div>

        <h2 className="mt-6 font-bold text-[18px]">Completion by subject</h2>
        <div className="bg-[#1C1C22] rounded-[24px] border border-[#2A2A32] mt-3 overflow-hidden">
          <div className="grid grid-cols-5 text-[11px] text-[#8A8A96] p-3 border-b border-[#2A2A32]"><span>SUBJECT</span><span>TOPICS</span><span>SCAFFOLDED</span><span>≥3 QS</span><span>IN REVIEW</span></div>
          {stats?.bySubject && Object.entries(stats.bySubject).map(([subj, v]: any) => (
            <div key={subj} className="grid grid-cols-5 p-3 text-[14px] border-b border-[#1C1C22]"><span className="font-bold">{subj}</span><span className="text-center">{v.topics}</span><span className="text-center">{v.scaffolded}</span><span className="text-center">{v.qs}</span><span className="text-center text-yellow-400">{v.inReview}</span></div>
          ))}
          {!stats?.bySubject && <div className="p-4 text-center text-[#8A8A96]">Live from DB: {stats?.total} topics</div>}
        </div>
      </div>

      <div className="h-20"></div>
      <div className="fixed bottom-0 w-full bg-[#15151A] border-t border-[#1C1C22] flex justify-around py-3 text-[11px] text-[#8A8A96]">
        <span className="flex flex-col items-center">🏠 Dashboard</span><span className="flex flex-col items-center">📖 Subjects</span><span className="flex flex-col items-center">📋 Exams</span><span className="flex flex-col items-center">📊 Progress</span><span className="flex flex-col items-center">👤 Profile</span>
      </div>
    </div>
  );
}
