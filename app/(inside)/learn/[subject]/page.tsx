"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const NODES = [
  { id:"A", label:"Exam Hook", icon:"🎯", color:"from-orange-500 to-red-500" },
  { id:"B", label:"Concept", icon:"📚", color:"from-blue-500 to-cyan-500" },
  { id:"C", label:"Example", icon:"✏️", color:"from-emerald-500 to-green-500" },
  { id:"D", label:"Traps", icon:"⚠️", color:"from-amber-500 to-orange-500" },
  { id:"E", label:"Challenge", icon:"🏆", color:"from-purple-500 to-pink-500" },
];

export default function RealLearn(){
  const p=useParams(); const subject=(p as any)?.subject as string;
  const [all,setAll]=useState<any[]>([]); const [topics,setTopics]=useState<string[]>([]);
  const [selTopic,setSelTopic]=useState(""); const [selNode,setSelNode]=useState("A");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ (async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    let data:any[]=[]; let from=0;
    while(true){
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*&order=title.asc`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`${from}-${from+999}`}
      });
      const chunk=await r.json(); if(!Array.isArray(chunk)||chunk.length===0) break;
      data=data.concat(chunk); if(chunk.length<1000) break; from+=1000; if(from>5000) break;
    }
    const filtered=data.filter((x:any)=>x.subject===subject);
    setAll(data); const t=[...new Set(filtered.map((x:any)=>x.title))].sort() as string[];
    setTopics(t); if(t[0]) setSelTopic(t[0]); setLoading(false);
  })(); },[subject]);

  const filteredNodes=all.filter(r=>r.subject===subject && r.title===selTopic).sort((a:any,b:any)=>a.node_label.localeCompare(b.node_label));
  const active=filteredNodes.find(n=>n.node_label===selNode);

  if(loading) return <div className="min-h-screen bg-[#0a0f1c] text-white p-10">Loading {subject}...</div>;

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-20">
      <div className="p-4 border-b border-white/10 sticky top-0 bg-[#0a0f1c]/95 backdrop-blur z-10">
        <h1 className="font-bold capitalize text-lg">{subject.replace("-"," ")} • {topics.length} modules</h1>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[380px] p-2 grid-cols-1 gap-1 max-h-[35vh] lg:max-h-[90vh] overflow-auto">
          {topics.map(t=>(
            <button key={t} onClick={()=>setSelTopic(t)} className={`text-left p-3 rounded-xl text-[13px] border truncate ${selTopic===t?"bg-white text-black":"bg-white/5 border-white/10"}`}>{t}</button>
          ))}
        </div>

        <div className="flex-1 p-3">
          <div className="flex gap-2 overflow-auto pb-2">
            {NODES.map(n=>(
              <button key={n.id} onClick={()=>setSelNode(n.id)} className={`min-w-[95px] p-3 rounded-2xl border ${selNode===n.id?"bg-white text-black":"bg-[#151b2b] border-white/10"}`}>
                <div>{n.icon} Node {n.id}</div><div className="text-[11px] opacity-70">{n.label}</div>
              </button>
            ))}
          </div>

          {active && (
            <div className={`mt-4 rounded-[20px] p-[1px] bg-gradient-to-br ${NODES.find(x=>x.id===selNode)?.color}`}>
              <div className="rounded-[19px] bg-[#121826] p-5">
                <div className="font-bold mb-1">Node {active.node_label} • {active.node_title}</div>
                <div className="text-sm opacity-80 whitespace-pre-wrap leading-relaxed">{active.content || active.summary || "Content for this node - ready to display CAPS lesson."}</div>
                <div className="flex gap-2 mt-6">
                  <button onClick={()=>{const i=NODES.findIndex(x=>x.id===selNode); if(i>0) setSelNode(NODES[i-1].id)}} className="px-4 py-2 bg-white/10 rounded-full text-sm">← Prev</button>
                  <button onClick={()=>{const i=NODES.findIndex(x=>x.id===selNode); if(i<4) setSelNode(NODES[i+1].id)}} className="px-4 py-2 bg-white text-black rounded-full text-sm ml-auto">Next →</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
