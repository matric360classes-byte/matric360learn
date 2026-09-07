"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubjectLearnPage(){
  const { subject } = useParams() as { subject: string };
  const [topics, setTopics] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/main_topics?subject=eq.${subject}&order=title.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setTopics(data);
      if(data?.[0]) setSelected(data[0]);
    }
    if(subject) load();
  },[subject]);

  useEffect(()=>{
    if(!selected) return;
    async function loadNodes(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?main_topic_id=eq.${selected.id}&order=node_label.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setNodes(data);
    }
    loadNodes();
  },[selected]);

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white p-4">
      <h1 className="text-[18px] font-bold capitalize mb-4">{subject} • {topics.length} topics</h1>
      <div className="flex gap-2 overflow-x-auto mb-6">
        {topics.map((t:any)=>(
          <button key={t.id} onClick={()=>setSelected(t)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selected?.id===t.id?'bg-white text-black':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{t.title.slice(0,28)}</button>
        ))}
      </div>
      {nodes.map((n:any)=>(
        <div key={n.id} className="bg-[#151720] border border-[#1f2230] rounded-[18px] p-4 mb-3">
          <p className="text-[11px] text-[#7c7cff] font-bold">NODE {n.node_label}</p>
          <p className="text-[14px] mt-1 whitespace-pre-wrap">{n.content}</p>
          {n.exam_hook && <div className="mt-3 bg-white text-black rounded-xl p-3 text-[13px]"><b>Exam Hook:</b> {n.exam_hook}</div>}
        </div>
      ))}
    </div>
  )
}
