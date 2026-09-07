"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubjectLearnPage(){
  const { subject } = useParams() as { subject: string };
  const [topics, setTopics] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [debug, setDebug] = useState("");

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/main_topics?subject=eq.${subject}&order=title.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      console.log("TOPICS", data);
      setDebug(`Topics found: ${data?.length || 0}`);
      if(Array.isArray(data)){ setTopics(data); if(data[0]) setSelected(data[0]); }
    }
    if(subject) load();
  },[subject]);

  useEffect(()=>{
    if(!selected) return;
    async function loadNodes(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      // Try main_topic_id first, then fallback to title
      let res = await fetch(`${url}/rest/v1/topic_knowledge?main_topic_id=eq.${selected.id}&order=node_label.asc`, {
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      let data = await res.json();
      console.log("NODES by id", data);

      if(!data || data.length===0){
        res = await fetch(`${url}/rest/v1/topic_knowledge?title=eq.${encodeURIComponent(selected.title)}&order=node_label.asc`, {
          headers:{ apikey:key, Authorization:`Bearer ${key}` }
        });
        data = await res.json();
        console.log("NODES by title fallback", data);
        setDebug(`Fallback by title: found ${data?.length || 0} for ${selected.title}`);
      } else {
        setDebug(`Found ${data.length} nodes for ${selected.title} by main_topic_id`);
      }
      if(Array.isArray(data)) setNodes(data);
    }
    loadNodes();
  },[selected]);

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white p-4">
      <h1 className="text-[18px] font-bold capitalize">{subject} • {topics.length} topics</h1>
      <p className="text-[11px] text-yellow-400 mb-2">DEBUG: {debug} | Selected ID: {selected?.id}</p>

      <div className="flex gap-2 overflow-x-auto mb-6">
        {topics.map((t:any)=>(
          <button key={t.id} onClick={()=>setSelected(t)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selected?.id===t.id?'bg-white text-black':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{t.title?.slice(0,28)}</button>
        ))}
      </div>

      <p className="text-[12px] text-zinc-500 mb-3">Nodes loaded: {nodes.length}</p>

      {nodes.map((n:any)=>(
        <div key={n.id} className="bg-[#151720] border border-[#1f2230] rounded-[18px] p-4 mb-3">
          <p className="text-[11px] text-[#7c7cff] font-bold">NODE {n.node_label} - {n.id.slice(0,6)}</p>
          <p className="text-[14px] mt-1 whitespace-pre-wrap">{n.content?.slice(0,400)}</p>
          {n.exam_hook && <div className="mt-3 bg-white text-black rounded-xl p-3 text-[13px]"><b>Exam Hook:</b> {n.exam_hook.slice(0,200)}</div>}
        </div>
      ))}

      {nodes.length===0 && <p className="text-red-400 text-sm">NO NODES - This is why only Exam Hook was showing before. Check Supabase topic_knowledge table.</p>}
    </div>
  )
}
