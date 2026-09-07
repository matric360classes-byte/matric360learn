"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const LABELS:any={A:"Exam Hook",B:"Learn The Concept",C:"Worked Example",D:"Examiner Traps",E:"Exam Challenge"};

export default function SubjectPage(){
  const params=useParams() as any;
  const raw=params.subject;
  const subject=decodeURIComponent(Array.isArray(raw)?raw[0]:raw||"").toLowerCase();
  const [rows,setRows]=useState<any[]>([]);
  const [selected,setSelected]=useState("");

  useEffect(()=>{
    async function load(){
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res=await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&select=*&order=title.asc,node_label.asc&limit=10000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await res.json();
      if(Array.isArray(data)){
        setRows(data);
        if(data.length &&!selected) setSelected(data[0].title);
      }
    }
    if(subject) load();
  },[subject]);

  const titles=Array.from(new Set(rows.map((r:any)=>r.title))).filter(Boolean) as string[];
  const nodes=rows.filter((r:any)=>r.title===selected);
  const yt=nodes.find((n:any)=>n.youtube_url)?.youtube_url||"";
  const ytId=yt.includes("v=")?yt.split("v=")[1].split("&")[0]:yt.split("/").pop()?.split("?")[0];

  return(
    <div className="min-h-screen bg-[#0c0d12] text-white pb-24">
      <div className="p-4 flex gap-2 overflow-x-auto">
        {titles.map(t=>(
          <button key={t} onClick={()=>setSelected(t)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selected===t?'bg-white text-black border-white':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{t}</button>
        ))}
      </div>
      <div className="mx-4 bg-black rounded-[22px] overflow-hidden aspect-video border border-[#1f2230] flex items-center justify-center">
        {ytId?<iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} allowFullScreen />:<p className="text-zinc-500 text-sm p-4">{selected||"Select a topic"} • {nodes.length} nodes found</p>}
      </div>
      <div className="p-4 space-y-3 mt-2">
        {['A','B','C','D','E'].map(letter=>{
          const node=nodes.find((n:any)=> (n.node_label||"").toUpperCase()===letter);
          return(
            <div key={letter} className={`rounded-[22px] p-4 flex justify-between items-center border ${node?'bg-[#151720] border-[#1f2230]':'bg-[#1c1c20] border-dashed border-zinc-700 opacity-60'}`}>
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#242640] flex items-center justify-center font-bold text-[#8b8eff]">{letter}</div>
                <div>
                  <p className="text-[11px] text-zinc-400">Node {letter} • {LABELS[letter]}</p>
                  <p className="text-[15px] font-bold">{LABELS[letter]}</p>
                  {!node && <p className="text-[11px] text-amber-400">Missing in DB for this topic</p>}
                </div>
              </div>
              <span className={node?"text-green-500":"text-zinc-600"}>{node?"✓":"○"}</span>
            </div>
          )
        })}
      </div>
      <p className="text-center text-[11px] text-zinc-600 mt-4">Debug: {rows.length} total rows • {titles.length} titles • {nodes.length} nodes for "{selected}"</p>
    </div>
  )
}
