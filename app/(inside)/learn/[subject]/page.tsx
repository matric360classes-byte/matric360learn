"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const NODES = [
  { id:"A", label:"Exam Hook", icon:"🎯" },
  { id:"B", label:"Concept", icon:"📚" },
  { id:"C", label:"Example", icon:"✏️" },
  { id:"D", label:"Traps", icon:"⚠️" },
  { id:"E", label:"Challenge", icon:"🏆" },
];

export default function LessonReader(){
  const { subject } = useParams() as {subject:string};
  const id = decodeURIComponent(subject);
  const [allNodes,setAllNodes]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      // First get the tapped node
      const r=await fetch(`${url}/rest/v1/lesson_nodes?id=eq.${id}&select=*`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      let first = (await r.json())[0];
      if(!first){
        const r2=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
          headers:{apikey:key, Authorization:`Bearer ${key}`}
        });
        const all=await r2.json();
        first = all.find((x:any)=> x.id===id || x.title===id);
      }
      if(!first) return;
      // Now get ALL 5 nodes with same title (A,B,C,D,E)
      const r3=await fetch(`${url}/rest/v1/lesson_nodes?title=eq.${encodeURIComponent(first.title)}&select=*`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      let siblings=await r3.json();
      if(!siblings || siblings.length<=1){
        // fallback: search by title contains
        const r4=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
          headers:{apikey:key, Authorization:`Bearer ${key}`}
        });
        const all=await r4.json();
        siblings = all.filter((x:any)=> x.title===first.title);
      }
      setAllNodes(siblings.sort((a:any,b:any)=>a.node_label.localeCompare(b.node_label)));
      // Set active to the node that was tapped
      const letter = first.node_label?.slice(-1) || first.node_label || "A";
      if(["A","B","C","D","E"].includes(letter)) setActive(letter);
    })();
  },[id]);

  const activeNode = allNodes.find(n=> (n.node_label||"").endsWith(active)) || allNodes.find(n=> n.node_label===active) || allNodes[0];
  if(!activeNode) return <div className="min-h-screen bg-[#0a0f1c] text-white p-6">Loading {id}... Found {allNodes.length} nodes</div>;

  const body = activeNode.content?.body_markdown || activeNode.content?.body || "";

  return(
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-24">
      <div className="p-4 sticky top-0 bg-[#0a0f1c] border-b border-white/10 z-10">
        <Link href="/learn" className="text-xs text-gray-400">← Back to 135 topics</Link>
        <h1 className="font-bold text-xl mt-1">{activeNode.title}</h1>
        <p className="text-xs opacity-60">{allNodes.length} Nodes • {body.length} chars • {activeNode.node_label}</p>
      </div>

      <div className="p-3">
        <div className="flex gap-2 overflow-auto pb-3">
          {NODES.map(n=>{
            const exists = allNodes.some(x=> (x.node_label||"").includes(n.id));
            return(
              <button key={n.id} onClick={()=>setActive(n.id)} className={`min-w-[90px] py-2 px-3 rounded-xl text-sm border ${active===n.id?"bg-white text-black font-bold":"bg-[#1a2235] border-white/10"} ${!exists?"opacity-30":""}`}>
                {n.icon} Node {n.id}<div className="text-[10px]">{n.label}</div>
              </button>
            )
          })}
        </div>

        <div className="rounded-[20px] bg-[#121826] border border-white/10 p-5">
          <div className="font-bold mb-3">Node {active} • {NODES.find(x=>x.id===active)?.label} • {activeNode.node_title || ""}</div>
          <div className="text-[14px] whitespace-pre-wrap leading-relaxed">
            {body}
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={()=>{const i=NODES.findIndex(x=>x.id===active); if(i>0) setActive(NODES[i-1].id)}} className="px-4 py-2 bg-white/10 rounded-full text-sm">← Prev</button>
            <button onClick={()=>{const i=NODES.findIndex(x=>x.id===active); if(i<4) setActive(NODES[i+1].id)}} className="px-4 py-2 bg-white text-black rounded-full text-sm ml-auto">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
