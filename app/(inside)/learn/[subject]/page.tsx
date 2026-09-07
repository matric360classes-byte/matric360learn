"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
export default function Page(){
  const p=useParams(); const subject=(p as any)?.subject || "mathematics";
  const [rows,setRows]=useState<any[]>([]); const [sel,setSel]=useState("");
  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*&limit=5000`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const d=await r.json(); setRows(d);
      const f=d.filter((x:any)=>x.subject===subject);
      const t=[...new Set(f.map((x:any)=>x.title))][0] as string;
      if(t) setSel(t);
    })();
  },[subject]);
  const filtered=rows.filter(r=>r.subject===subject);
  const titles=[...new Set(filtered.map(r=>r.title))].sort() as string[];
  const nodes=filtered.filter(r=>r.title===sel).sort((a:any,b:any)=>a.node_label.localeCompare(b.node_label));
  return(<div className="p-4 bg-[#0a0f1c] min-h-screen text-white">
    <div className="text-xs opacity-60">Slug: {subject} • {rows.length} total • {filtered.length} filtered • {titles.length} titles</div>
    <div className="flex flex-wrap gap-1 my-3">{titles.map(t=><button key={t} onClick={()=>setSel(t)} className={`border px-2 py-1 text-xs ${sel===t?"bg-white text-black":"bg-zinc-800"}`}>{t}</button>)}</div>
    <div className="mb-3">Select a topic • {nodes.length} nodes found for "{sel}"</div>
    {["A","B","C","D","E"].map(l=>{const n=nodes.find((x:any)=>x.node_label===l); return <div key={l} className="border-b border-zinc-800 py-2"><div>Node {l} • {n?.node_title||"Missing"}</div><div className={n?"text-green-400":"text-red-400"}>{n?`✓ Found: ${n.title}`:"Missing in DB"}</div></div>})}
  </div>);
}
