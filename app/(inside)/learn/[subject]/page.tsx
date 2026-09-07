"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubjectLearnPage(){
  const params = useParams() as any;
  const raw = params.subject || "";
  const subject = decodeURIComponent(raw).toLowerCase().replace(/^\[|\]$/g,"");
  const [rows][setRows] = useState<any[]>([]);
  const [selectedTitle][setSelectedTitle] = useState<string>("");
  const [debug][setDebug] = useState("");

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&order=title.asc,node_label.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      console.log("ROWS", data);
      setDebug(`Subject: ${subject} | Rows: ${data?.length||0}`);
      if(Array.isArray(data)){
        setRows(data);
        const firstTitle = data[0]?.title;
        if(firstTitle) setSelectedTitle(firstTitle);
      }
    }
    if(subject) load();
  },[subject]);

  const uniqueTitles = Array.from(new Set(rows.map((r:any)=>r.title))).filter(Boolean);
  const nodes = rows.filter((r:any)=> r.title === selectedTitle);

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white p-4 pb-24">
      <h1 className="text-[18px] font-bold capitalize">{subject} • {uniqueTitles.length} topics</h1>
      <p className="text-[11px] text-yellow-400 mb-3">{debug} | Nodes for selected: {nodes.length}</p>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {uniqueTitles.map((title:any)=>(
          <button key={title} onClick={()=>setSelectedTitle(title)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selectedTitle===title?'bg-white text-black border-white':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{String(title).slice(0,26)}</button>
        ))}
      </div>

      {nodes.map((n:any)=>(
        <div key={n.id} className="bg-[#151720] border border-[#1f2230] rounded-[18px] p-4 mb-3">
          <p className="text-[10px] font-bold text-[#7c7cff] tracking-widest">NODE {n.node_label} • {n.title}</p>
          <p className="text-[14px] mt-2 whitespace-pre-wrap leading-relaxed">{n.content}</p>
          {n.exam_hook && <div className="mt-3 bg-white text-black rounded-xl p-3 text-[13px]"><b>Exam Hook:</b> {n.exam_hook}</div>}
          {n.youtube_url && <p className="mt-2 text-[12px] text-zinc-500">▶️ {n.youtube_url}</p>}
        </div>
      ))}

      {rows.length>0 && nodes.length===0 && <p className="text-red-400 text-sm">Rows exist but no nodes matched title {selectedTitle}</p>}
      {rows.length===0 && <p className="text-red-400 text-sm">No rows in topic_knowledge for subject={subject} — check spelling physical-sciences / mathematics</p>}
    </div>
  )
}
