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

function parseContent(row:any){
  if(!row) return "";
  const c = row.content;
  if(!c) return "";
  // New structure from your generation
  if(c.body_markdown) return c.body_markdown;
  if(c.body) return c.body;
  if(typeof c === "string") return c;
  return JSON.stringify(c,null,2);
}

export default function RealLearn(){
  const p=useParams();
  const subject = (p as any)?.subject as string;
  const [all,setAll]=useState<any[]>([]);
  const [topics,setTopics]=useState<string[]>([]);
  const [selTopic,setSelTopic]=useState("");
  const [selNode,setSelNode]=useState("A");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ (async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const r=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
      headers:{apikey:key, Authorization:`Bearer ${key}`}
    });
    const data=await r.json();
    if(!Array.isArray(data)) { setLoading(false); return; }

    // Filter by subject slug if present, otherwise show all
    // Your node_label is like "PHYS-01-A" so we keep all for now
    setAll(data);
    const t=[...new Set(data.map((x:any)=>x.title))].sort() as string[];
    setTopics(t);
    if(t[0]) setSelTopic(t[0]);
    setLoading(false);
  })(); },[subject]);

  const filteredNodes=all.filter(r=>r.title===selTopic).sort((a:any,b:any)=>a.node_label.localeCompare(b.node_label));
  const active=filteredNodes.find(n=>n.node_label.endsWith(`-${selNode}`) || n.node_label===selNode) || filteredNodes.find(n=>n.node_label.includes(selNode)) || filteredNodes[0];

  if(loading) return <div className="min-h-screen bg-[#0a0f1c] text-white p-10">Loading {subject}... 135 topics found</div>;

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-24">
      <div className="p-4 border-b border-white/10 sticky top-0 bg-[#0a0f1c] z-10">
        <h1 className="font-bold capitalize text-xl">{subject} • {topics.length} modules • {all.length} lessons</h1>
        <p className="text-xs opacity-60 truncate">{selTopic} {active? `• ${active.content?.body_markdown?.length || 0} chars` : ""}</p>
      </div>

      <div className="flex flex-col">
        <div className="p-3 max-h-[28vh] overflow-auto flex flex-wrap gap-1.5 border-b border-white/10">
          {topics.map(t=>(
            <button key={t} onClick={()=>setSelTopic(t)} className={`text-left px-3 py-1.5 rounded-full text-xs border ${selTopic===t?"bg-white text-black":"bg-white/10 border-white/10"}`}>{t.slice(0,40)}</button>
          ))}
        </div>

        <div className="p-3">
          <div className="flex gap-2 overflow-auto pb-2">
            {NODES.map(n=>(
              <button key={n.id} onClick={()=>setSelNode(n.id)} className={`min-w-[90px] py-2 px-3 rounded-xl text-sm border ${selNode===n.id?"bg-white text-black font-bold":"bg-[#1a2235] border-white/10"}`}>{n.icon} Node {n.id}<div className="text-[10px] opacity-70">{n.label}</div></button>
            ))}
          </div>

          {active? (
            <div className={`mt-4 rounded-[20px] p-[1px] bg-gradient-to-br ${NODES.find(x=>x.id===selNode)?.color}`}>
              <div className="rounded-[19px] bg-[#121826] p-5">
                <div className="font-bold text-base mb-3">Node {selNode} • {active.title} • {active.node_title || NODES.find(x=>x.id===selNode)?.label}</div>
                <div className="text-[14px] opacity-90 whitespace-pre-wrap leading-relaxed">
                  {parseContent(active)}
                </div>
                <div className="flex gap-2 mt-6">
                  <button onClick={()=>{const i=NODES.findIndex(x=>x.id===selNode); if(i>0) setSelNode(NODES[i-1].id)}} className="px-4 py-2 bg-white/10 rounded-full text-sm">← Prev</button>
                  <button onClick={()=>{const i=NODES.findIndex(x=>x.id===selNode); if(i<4) setSelNode(NODES[i+1].id)}} className="px-4 py-2 bg-white text-black rounded-full text-sm ml-auto">Next →</button>
                </div>
              </div>
            </div>
          ) : <div className="p-10 text-center opacity-50">No nodes for {selTopic}</div>}
        </div>
      </div>
    </div>
  );
}
