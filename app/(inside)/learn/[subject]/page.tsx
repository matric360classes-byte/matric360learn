"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SubjectLearnPage(){
  const { subject } = useParams() as { subject: string };
  const [topics, setTopics] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

useEffect(()=>{
  async function load(){
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res = await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&order=node_label.asc`, {
      headers:{ apikey:key, Authorization:`Bearer ${key}` }
    });
    const data = await res.json();
    if(Array.isArray(data)) setTopics(data);
  }
  if(subject) load();
},[subject]);

  async function askTutor(){
    if(!question ||!selected) return;
    setLoading(true); setAnswer("");
    try{
      const res = await fetch("/api/tutor",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ question, topic: selected.title, node: selected.content }) });
      const j = await res.json(); setAnswer(j.answer||"");
    }finally{ setLoading(false) }
  }

  // Group by topic title - so you see Topics list okay
  const uniqueTopics = Array.from(new Map(topics.map((t:any)=>[t.main_topic_id||t.title, t])).values());
  const nodesForSelected = selected? topics.filter((t:any)=> (t.main_topic_id||t.title) === (selected.main_topic_id||selected.title)) : [];

  return (
    <div className="min-h-screen bg-[#0c0d12] text-white p-4">
      <h1 className="text-[20px] font-bold capitalize mb-4">{subject?.replace(/-/g,' ')} • {uniqueTopics.length} topics LIVE</h1>

      <div className="flex gap-3 overflow-x-auto mb-6">
        {uniqueTopics.map((t:any)=>(
          <button key={t.id} onClick={()=>setSelected(t)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] border ${selected?.id===t.id?'bg-white text-black border-white':'bg-[#151720] border-[#1f2230] text-zinc-400'}`}>{t.title?.slice(0,22)}</button>
        ))}
      </div>

      {!selected && <p className="text-zinc-500 text-sm">Select a topic above to see all Nodes A-E</p>}

      {selected && (
        <div className="space-y-3">
          {nodesForSelected.map((node:any)=>(
            <div key={node.id} className="bg-[#151720] border border-[#1f2230] rounded-[18px] p-4">
              <p className="text-[11px] text-[#7c7cff] font-bold mb-1">NODE {node.node_label || node.node}</p>
              <p className="text-[14px] leading-snug">{node.content}</p>
            </div>
          ))}
          {nodesForSelected.length===0 && <p className="text-sm text-red-400">No Nodes found for this topic — this was the bug.</p>}
        </div>
      )}
    </div>
  )
}
