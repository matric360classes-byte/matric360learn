"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// USE ANON KEY, NOT SECRET KEY - secret key in browser is dangerous
const supabase = createClient(
  "https://civwluydzbwqInipmcmkhe.supabase.co",
  "YOUR_ANON_KEY_HERE - get from Supabase Settings > API > anon public"
);

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contentOpen, setContentOpen] = useState(true);
  const [kbOpen, setKbOpen] = useState(false);
  const [examOpen, setExamOpen] = useState(false);
  const [genOpen, setGenOpen] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [bySubject, setBySubject] = useState<any>({});

  useEffect(() => {
    (async () => {
      // FIXED QUERIES - uses topic_name not id counting
      const { data: topics } = await supabase.from("topic_knowledge").select("*");
      const { data: lessons } = await supabase.from("lesson_previews").select("topic_id");
      const { data: questions } = await supabase.from("questions").select("topic_id");

      const qMap: any = {};
      questions?.forEach((q: any) => { qMap[q.topic_id] = (qMap[q.topic_id] || 0) + 1; });

      const t = topics || [];
      const totalLive = t.length; // direct length, not count
      const distinctTopics = new Set(t.map((x:any)=> x.topic_name)).size;

      setStats({
        total: distinctTopics, // 16 now, not 0
        totalRows: totalLive, // 16 rows = 16 nodes
        published: t.filter((x: any) => x.status === 'published' || x.is_published).length,
        inReview: t.filter((x: any) => x.status === 'in_review').length,
        draft: t.filter((x: any) =>!x.status || x.status === 'draft').length,
      });

      const bySub: any = {};
      t.forEach((x:any)=>{
        const subj = x.subject || 'Unknown';
        if(!bySub[subj]) bySub[subj] = { total:0, nodes:0 }
        bySub[subj].total++
      })
      setBySubject(bySub);
    })();
  }, []);

  if(!stats) return <div className="p-6">Loading factory...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">NodeFactory Admin</h1>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="border p-4 rounded">Total Topics (distinct)<br/><b className="text-3xl">{stats.total}</b></div>
        <div className="border p-4 rounded">Total Nodes A-E (rows)<br/><b className="text-3xl">{stats.totalRows}</b></div>
        <div className="border p-4 rounded bg-yellow-50">Missing Nodes<br/><b className="text-3xl text-red-600">{(stats.total*5)-stats.totalRows}</b> / {stats.total*5}</div>
        <div className="border p-4 rounded">Published<br/><b className="text-2xl">{stats.published}</b></div>
        <div className="border p-4 rounded">In Review<br/><b className="text-2xl">{stats.inReview}</b></div>
        <div className="border p-4 rounded">Draft<br/><b className="text-2xl">{stats.draft}</b></div>
      </div>
      <div className="mt-6">
        <h2 className="font-bold">By Subject</h2>
        <pre className="bg-gray-100 p-3 rounded text-xs">{JSON.stringify(bySubject, null, 2)}</pre>
      </div>
      <p className="mt-4 text-sm text-gray-500">After save: Vercel redeploys → hard refresh Ctrl+Shift+R → should show 16 not 0</p>
    </div>
  )
}
