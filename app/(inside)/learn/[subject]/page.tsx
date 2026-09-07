"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubjectLearnPage(){
  const params = useParams() as any;
  const raw = params.subject || "";
  const subject = decodeURIComponent(raw).toLowerCase();
  const [rows, setRows] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [debug, setDebug] = useState("");

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&order=title.asc,node_label.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      setDebug(`Subject: ${subject} | Rows: ${data?.length||0}`);
      if(Array.isArray(data)){
        setRows(data);
        if(data[0]?.title) setSelectedTitle(data[0].title);
      }
    }
    if(subject) load();
  },[subject]);

  const uniqueTitles = Array.from(new Set(rows.map((r:any)=>r.title))).filter(Boolean);
  const nodes = rows.filter((r:any)=> r.title === selectedTitle);

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white p-4 pb-24">
      <h1 className="text-[18px] font-bold capitalize">{subject} - {uniqueTitles.length} topics</h1>
      <p className="text-[11px] text-yellow-400 mb-3">{debug} | Nodes: {nodes.length}</p>
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {uniqueTitles.map((title:any)=>(
          <button key={title} onClick={()=>setSelectedTitle(title)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selectedTitle===title?'bg-white text-black':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{String(title).slice(0,26)}</button>
        ))}
      </div>
      {nodes.map((n:any)=>(
        <div key={n.id} className="bg-[#151720] border border-[#1f2230] rounded-[18px] p-4 mb-3">
          <p className="text-[10px] font-bold text-[#7c7cff]">NODE {n.node_label}</p>
          <p className="text-[14px] mt-2 whitespace-pre-wrap">{n.content}</p>
          {n.exam_hook && <div className="mt-3 bg-white text-black rounded-xl p-3 text-[13px]"><b>Exam Hook:</b> {n.exam_hook}</div>}
        </div>
      ))}
    </div>
  )
}
