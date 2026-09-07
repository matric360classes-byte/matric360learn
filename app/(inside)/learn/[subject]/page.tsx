"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Row = {
  subject: string;
  title: string;
  topic_name: string;
  node_label: string;
  node_title: string;
  caps_code: string;
  youtube_url: string;
};

export default function SubjectPage(){
  const params = useParams();
  const subject = (params as any)?.subject || (params as any)?.slug || "mathematics";
  const [allRows, setAllRows] = useState<Row[]>([]);
  const [selected, setSelected] = useState("");

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?select=*&limit=5000`,{
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      if(Array.isArray(data)){
        const filtered = data.filter((d:any)=>d.subject===subject);
        setAllRows(data);
        const titles = Array.from(new Set(filtered.map((d:any)=>d.title))) as string[];
        if(titles[0]) setSelected(titles[0]);
      }
    }
    load();
  },[subject]);

  const filtered = allRows.filter(r=>r.subject===subject);
  const titles = Array.from(new Set(filtered.map(r=>r.title))).sort() as string[];
  const nodes = filtered.filter(r=>r.title===selected).sort((a,b)=>a.node_label.localeCompare(b.node_label));

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white p-4">
      <div className="text-xs opacity-60 mb-2">Slug: {subject} • {allRows.length} total • {filtered.length} filtered • {titles.length} titles</div>
      <div className="flex gap-2 flex-wrap mb-4 max-h-32 overflow-auto">
        {titles.map(t=>(
          <button key={t} onClick={()=>setSelected(t)} className={`px-2 py-1 rounded text-xs border ${selected===t?"bg-white text-black":"bg-zinc-800"}`}>{t}</button>
        ))}
      </div>
      <div className="mb-4 text-sm">Select a topic • {nodes.length} nodes found for "{selected}"</div>
      {["A","B","C","D","E"].map(l=>{
        const n = nodes.find(x=>x.node_label===l);
        return(
          <div key={l} className="mb-3 border-b border-zinc-800 pb-2">
            <div className="font-bold">Node {l} • {n?.node_title||"Missing"}</div>
            <div className={n?"text-green-400 text-sm":"text-red-400 text-sm"}>{n?`✓ Found: ${n.title}`:"Missing in DB"}</div>
          </div>
        )
      })}
    </div>
  );
}
