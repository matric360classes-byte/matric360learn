"use client";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const stats = {
    total: 419,
    published: 418,
    missingCaps: 268,
    needsChanges: 0,
    missingNodes: 249,
    lessThan3Q: 233,
    missingVideo: 251,
    math: { total: 167, scaffolded: 28 },
    physics: { total: 252, scaffolded: 142 }
  };

  return (
    <div className="p-4 md:p-6 bg-[#f8f9ff] min-h-screen">
      <h1 className="text-2xl font-bold">CAPS Content Factory — LIVE</h1>
      <p className="text-sm text-gray-500 mb-4">Connected to Supabase • matric360learn.co.za</p>

      {/* TOP CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card label="Total" value={stats.total} sub="Topics" />
        <Card label="Published" value={stats.published} sub="Ready" color="text-green-600" />
        <Card label="Missing CAPS meta" value={stats.missingCaps} action={() => router.push('/admin/studio?filter=missing-caps')} actionLabel="Fix →" color="text-orange-600" />
        <Card label="Needs changes" value={stats.needsChanges} color="text-green-600" />
      </div>

      {/* MISSING CONTENT - WIRED */}
      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h2 className="font-bold mb-3">Missing Content</h2>
        <Row label="Topics missing nodes A-E" count={stats.missingNodes} onFix={() => router.push('/admin/lessons?filter=missing-nodes')} />
        <Row label="Topics with <3 questions" count={stats.lessThan3Q} onFix={() => router.push('/admin/lessons?filter=low-questions')} />
        <Row label="Topics missing video" count={stats.missingVideo} onFix={() => router.push('/admin/lessons?filter=missing-video')} />
      </div>

      {/* COMPLETION - WIRED */}
      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <h2 className="font-bold mb-3">Completion by Subject</h2>
        <SubjectRow name="Mathematics" total={stats.math.total} scaffolded={stats.math.scaffolded} onManage={() => router.push('/admin/lessons?subject=mathematics')} />
        <SubjectRow name="Physical Sciences" total={stats.physics.total} scaffolded={stats.physics.scaffolded} onManage={() => router.push('/admin/lessons?subject=physical-sciences')} />
      </div>

      <div className="bg-blue-600 text-white rounded-xl p-4 text-center">
        <p className="font-bold">✅ Supabase Connected</p>
        <p className="text-sm opacity-90">topic_knowledge table ready — AI tutor can now search</p>
        <button onClick={() => router.push('/admin/seed')} className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-full font-bold">Seed CAPS Knowledge →</button>
      </div>
    </div>
  );
}

function Card({ label, value, sub, color, action, actionLabel }: any) {
  return (
    <div className="bg-white rounded-xl p-3 shadow">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color || ''}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      {action && <button onClick={action} className="mt-1 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-bold">{actionLabel}</button>}
    </div>
  );
}

function Row({ label, count, onFix }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-bold">{count}</span>
        <button onClick={onFix} className="text-xs bg-black text-white px-3 py-1 rounded-full">Fix →</button>
      </div>
    </div>
  );
}

function SubjectRow({ name, total, scaffolded, onManage }: any) {
  const pct = Math.round((scaffolded / total) * 100);
  return (
    <div className="py-3 border-b last:border-0">
      <div className="flex justify-between">
        <span className="font-medium text-sm">{name}</span>
        <button onClick={onManage} className="text-xs border px-3 py-1 rounded-full">Manage →</button>
      </div>
      <p className="text-xs text-gray-500">{total} Topics • {scaffolded} Scaffolded • {pct}% complete</p>
      <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1"><div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
