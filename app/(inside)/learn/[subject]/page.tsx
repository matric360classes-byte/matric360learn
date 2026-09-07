"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
export default function Page(){
  const p=useParams(); const subject=(p as any)?.subject as string || "mathematics";
  const [rows,setRows]=useState<any[]>([]); const [sel,setSel]=useState("");
  useEffect(()=>{ (async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    let all:any[]=[]; let from=0; const step=1000;
    while(true){
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*&order=title.asc`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`${from}-${from+step-1}`, Prefer:'count=exact'}
      });
      const chunk=await r.json();
      if(!Array.isArray(chunk) || chunk.length===0) break;
      all=all.concat(chunk);
      if(chunk.length<step) break;
      from+=step;
      if(from>5000) break;
    }
    setRows(all);
    const f=all.filter((x:any)=>x.subject===subject);
    const first=[...new Set(f.map((x:any)=>x.title))][0] as string; if(first) setSel(first);
  })(); },[subject]);
  const filtered=rows.filter(r=>r.subject===subject);
  const titles=[...new Set(filtered.map(r=>r.title))].sort() as string[];
  const nodes=filtered.filter(r=>r.title===sel).sort((a:any,b:any)=>a.node_label.localeCompare(b.node_label));
  return(<div className="p-4 bg-[#0a0f1c] min-h-screen text-white">
    <div className="text-xs opacity-70">Slug: {subject} • {rows.length} total • {filtered.length} filtered • {titles.length} titles</div>
    <div className="flex flex-wrap gap-1 my-3 max-h-40 overflow-auto">{titles.map(t=><button key={t} onClick={()=>setSel(t)} className={`border px-2 py-1 text-xs ${sel===t?"bg-white text-black":"bg-zinc-800"}`}>{t}</button>)}</div>
    <div className="my-2">Select a topic • {nodes.length} nodes found for "{sel}"</div>
    {["A","B","C","D","E"].map(l=>{const n=nodes.find((x:any)=>x.node_label===l); return <div key={l} className="border-b border-zinc-700 py-2"><div>Node {l} • {n?.node_title||"Missing"}</div><div className={n?"text-green-400":"text-red-400"}>{n?`✓ Found: ${n.title}`:"Missing"}</div></div>})}
  </div>);
}
