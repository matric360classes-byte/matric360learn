"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const LABELS:any={A:"Exam Hook",B:"Learn The Concept",C:"Worked Example",D:"Examiner Traps",E:"Exam Challenge"};

export default function SubjectPage(){
  const params=useParams() as any;
  const subject=decodeURIComponent(params.subject||"").toLowerCase();
  const [rows,setRows]=useState<any[]>([]);
  const [selected,setSelected]=useState("");
  useEffect(()=>{
    async function load(){
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res=await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&order=title.asc,node_label.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const data=await res.json();
      if(Array.isArray(data)&&data.length){setRows(data); if(!selected) setSelected(data[0].title);}
    }
    if(subject) load();
  },[subject]);
  const titles=Array.from(new Set(rows.map((r:any)=>r.title))).filter(Boolean) as string[];
  const nodes=rows.filter((r:any)=>r.title===selected);
  const ytUrl=nodes.find((n:any)=>n.youtube_url)?.youtube_url||"";
  const ytId=ytUrl.includes("v=")?ytUrl.split("v=")[1].split("&")[0]:ytUrl.split("/").pop();
  return(
    <div className="min-h-screen bg-[#0c0d12] text-white pb-24">
      <div className="p-4 flex gap-2 overflow-x-auto">
        {titles.map(t=>(
          <button key={t} onClick={()=>setSelected(t)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selected===t?'bg-white text-black':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>
            {t.slice(0,30)}
          </button>
        ))}
      </div>
      <div className="mx-4 bg-black rounded-[22px] overflow-hidden aspect-video border border-[#1f2230] flex items-center justify-center">
        {ytId? <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} allowFullScreen /> : <p className="text-zinc-500 text-sm">{selected}</p>}
      </div>
      <div className="p-4 space-y-3 mt-2">
        {['A','B','C','D','E'].map(letter=>{
          const node=nodes.find((n:any)=>n.node_label===letter);
          if(!node) return null;
          return(
            <div key={letter} className="bg-[#151720] border border-[#1f2230] rounded-[22px] p-4 flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-[#242640] flex items-center justify-center font-bold text-[#8b8eff]">{letter}</div>
                <div>
                  <p className="text-[11px] text-zinc-400">Node {letter} • {LABELS[letter]}</p>
                  <p className="text-[15px] font-bold">{LABELS[letter]}</p>
                </div>
              </div>
              <span className="text-green-500">✓</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
