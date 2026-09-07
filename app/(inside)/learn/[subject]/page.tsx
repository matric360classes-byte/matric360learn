"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
const LABELS:any={A:"Exam Hook",B:"Learn The Concept",C:"Worked Example",D:"Examiner Traps",E:"Exam Challenge"};
export default function SubjectPage(){
  const params=useParams() as any;
  const raw=params.subject;
  const slug=decodeURIComponent(Array.isArray(raw)?raw[0]:raw||"").toLowerCase();
  const [rows,setRows]=useState<any[]>([]);
  const [allRows,setAllRows]=useState<any[]>([]);
  const [selected,setSelected]=useState("");
  useEffect(()=>{
    async function load(){
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      // Fetch ALL then filter locally — fixes slug vs "Physical Sciences" mismatch
      const res=await fetch(`${url}/rest/v1/topic_knowledge?select=*&limit=10000`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const data=await res.json();
      if(Array.isArray(data)){
        setAllRows(data);
        // Try to match slug to subject column in 3 ways
        const filtered=data.filter((r:any)=>{
          const subj=(r.subject||"").toLowerCase();
          return subj===slug || subj===slug.replace(/-/g," ") || subj.includes(slug.split("-")[0]);
        });
        const useRows=filtered.length>0?filtered:data;
        setRows(useRows);
        if(useRows.length){
          const firstTitle=Array.from(new Set(useRows.map((r:any)=>r.title)))[0] as string;
          setSelected(firstTitle||"");
        }
      }
    }
    load();
  },[slug]);
  const titles=Array.from(new Set(rows.map((r:any)=>r.title))).filter(Boolean) as string[];
  const nodes=rows.filter((r:any)=>r.title===selected);
  return(
    <div className="min-h-screen bg-[#0c0d12] text-white p-4 pb-24">
      <p className="text-[11px] text-zinc-500 mb-2">Slug: {slug} • DB subjects found: {Array.from(new Set(allRows.map((r:any)=>r.subject))).slice(0,5).join(", ")} • Total: {allRows.length} rows • Filtered: {rows.length}</p>
      <div className="flex gap-2 overflow-x-auto mb-3">
        {titles.slice(0,30).map(t=>(
          <button key={t} onClick={()=>setSelected(t)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selected===t?'bg-white text-black':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{t}</button>
        ))}
      </div>
      <p className="mb-3 text-sm">Select a topic • {nodes.length} nodes found for "{selected}"</p>
      <div className="space-y-3">
        {['A','B','C','D','E'].map(letter=>{
          const node=nodes.find((n:any)=>(n.node_label||"").toUpperCase()===letter);
          return(
            <div key={letter} className={`rounded-[22px] p-4 border ${node?'bg-[#151720] border-[#1f2230]':'bg-[#1c1c20] border-dashed border-zinc-700'}`}>
              <p className="text-[11px] text-zinc-400">Node {letter} • {LABELS[letter]}</p>
              <p className="font-bold">{LABELS[letter]}</p>
              <p className="text-[11px] mt-1 ${node?'text-green-400':'text-amber-400'}">{node?`✓ Found: ${(node.title||"").slice(0,50)}`:'Missing in DB for this topic'}</p>
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-zinc-600 mt-6 text-center">Debug: {allRows.length} total • {rows.length} filtered • {titles.length} titles</p>
    </div>
  )
}
