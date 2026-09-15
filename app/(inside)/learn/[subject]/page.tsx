"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const NODES = [
  { id:"A", label:"Exam Hook", icon:"🎯", color:"from-orange-500 to-red-500" },
  { id:"B", label:"Concept", icon:"📚", color:"from-blue-500 to-cyan-500" },
  { id:"C", label:"Example", icon:"✏️", color:"from-emerald-500 to-green-500" },
  { id:"D", label:"Traps", icon:"⚠️", color:"from-amber-500 to-orange-500" },
  { id:"E", label:"Challenge", icon:"🏆", color:"from-purple-500 to-pink-500" },
];

export default function LessonReader(){
  const { subject } = useParams() as {subject:string};
  const id = decodeURIComponent(subject);
  const [node,setNode]=useState<any>(null);
  const [active,setActive]=useState("A");

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/lesson_nodes?id=eq.${id}&select=*`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await r.json();
      setNode(data[0]);
    })();
  },[id]);

  if(!node) return <div className="min-h-screen bg-[#0a0f1c] text-white p-10">Loading {id}...</div>;

  const body = node.content?.body_markdown || node.content?.body || JSON.stringify(node.content);

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-24">
      <div className="p-4 sticky top-0 bg-[#0a0f1c] border-b border-white/10 z-10">
        <Link href="/learn" className="text-xs text-gray-400">← Back to 135 topics</Link>
        <h1 className="font-bold text-xl mt-1">{node.title}</h1>
        <p className="text-xs opacity-60">{node.node_label} • {body.length} chars</p>
      </div>

      <div className="p-3">
        <div className="flex gap-2 overflow-auto pb-2">
          {NODES.map(n=>(
            <button key={n.id} onClick={()=>setActive(n.id)} className={`min-w-[90px] py-2 px-3 rounded-xl text-sm border ${active===n.id?"bg-white text-black font-bold":"bg-[#1a2235] border-white/10"}`}>
              {n.icon} Node {n.id}
              <div className="text-[10px] opacity-70">{n.label}</div>
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-[20px] p-[1px] bg-gradient-to-br ${NODES.find(x=>x.id===active)?.color}`}>
          <div className="rounded-[19px] bg-[#121826] p-5">
            <div className="font-bold mb-3">Node {active} • {NODES.find(x=>x.id===active)?.label}</div>
            <div className="text-[14px] whitespace-pre-wrap leading-relaxed opacity-90">
              {body}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
