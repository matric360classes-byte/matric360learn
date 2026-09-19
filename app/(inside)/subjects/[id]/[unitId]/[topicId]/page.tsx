"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const META:any = {
  A:{label:"Exam Hook", icon:"📌", color:"#ff6b35"},
  B:{label:"Learn The Concept", icon:"📚", color:"#3b82f6"},
  C:{label:"Worked Example", icon:"📝", color:"#10b981"},
  D:{label:"Examiner Traps", icon:"⚠️", color:"#f59e0b"},
  E:{label:"Exam Challenge", icon:"🏆", color:"#8b5cf6"},
};
const TYPE_TO_LABEL:any = { EXAM_HOOK:"A", CONCEPT:"B", LEARN_THE_CONCEPT:"B", WORKED_EXAMPLE:"C", EXAMINER_TRAPS:"D", TRAPS:"D", EXAM_CHALLENGE:"E" };

function MathRenderer({ text }: { text: string }) {
  if (!text) return <div style={{color:"#ff6b35"}}>No content</div>;
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs;
  const parts = text.split(regex);
  const html = parts.map(part=>{
    if(!part) return '';
    const isBlock = (part.startsWith('\\[')&&part.endsWith('\\]')) || (part.startsWith('$$')&&part.endsWith('$$'));
    const isInline = (part.startsWith('\\(')&&part.endsWith('\\)')) || (part.startsWith('$')&&part.endsWith('$')&&part.length>2);
    if(isBlock||isInline){
      let math = part.slice(2,-2); if(part.startsWith('$')&&!part.startsWith('$$')) math=part.slice(1,-1);
      try{ return katex.renderToString(math,{displayMode:isBlock,throwOnError:false}) }catch{return part}
    }
    return part.replace(/\*\*(.*?)\*\*/g,'<b style="color:#fff">$1</b>').replace(/\n/g,'<br/>');
  }).join('');
  return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.9',fontSize:'15px',color:'#e5e7eb'}} />
}

export default function Page(){
  const p = useParams() as any;
  const subjectId=p?.id, unitId=p?.unitId, topicId=p?.topicId;
  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const cleanId = decodeURIComponent(topicId||"").toLowerCase().trim();
    const cleanNoDash = cleanId.replace(/-/g," ").trim();

    // TRY 1: Normal allocation via caps_knowledge_base -> 675 proper
    try{
      const q1 = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic&topic=ilike.%${cleanNoDash}%&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const r1:any = await q1.json();
      if(Array.isArray(r1) && r1[0]?.id){
        const kb = r1[0];
        const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
        let nodes:any = await res.json();
        if(Array.isArray(nodes) && nodes.length>0){
          console.log("GREEN VIA KB",nodes.length,kb.topic);
          const seen=new Set();
          nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
          setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
          return;
        }
      }
    }catch(e){ console.log("KB failed",e) }

    // TRY 2: EMERGENCY - search 675 nodes directly for cubic keyword - allocates even when KB blocked
    const res2 = await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let all:any = await res2.json();
    if(!Array.isArray(all)){ console.log("NODES BLOCKED",all); return; }

    // Find the 5 that belong to cubic - group by caps_topic_id, filter by content containing topic
    // First find caps_topic_ids where content contains cubic
    const matching = all.filter((n:any)=>{
      const c = JSON.stringify(n.content||"").toLowerCase() + (n.body_markdown||"").toLowerCase();
      return c.includes(cleanNoDash);
    });

    if(matching.length>0){
      const topId = matching[0].caps_topic_id;
      const finalNodes = all.filter((n:any)=> n.caps_topic_id===topId);
      console.log("GREEN VIA DIRECT 675 SEARCH",finalNodes.length,topId);
      const seen=new Set();
      const uniq = finalNodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
      setRows(uniq.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
    } else {
      console.log("0 found for",cleanNoDash,"in 675 nodes. Sample topic:", all[0]?.content);
    }
  })()},[topicId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || (typeof n?.content==='string'? n.content:"") || "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back</Link>
        <h1 style={{fontSize:26,fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12,color:rows.length?"#00ff88":"#ff6b35"}}>🔒 {rows.length} NODES • {rows[0]?.caps_topic_id?.slice(0,8)||clean} • {rows.length? "675 Allocated":"Blocked by RLS - run SQL above"}</div>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{flexShrink:0,padding:"10px 18px",borderRadius:24,border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:24,border:"1px solid #252a44"}}>
        <div style={{padding:16,borderBottom:"1px solid #252a44",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:12,background:meta?.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta?.icon}</div>
          <div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:11,color:"#6b7280"}}>{activeNode?.node_type} • {activeNode?.caps_topic_id?.slice(0,8)}</div></div>
        </div>
        <div style={{padding:20,minHeight:250}}>
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Fix RLS in Supabase - then 675 will go green. Console shows error.</div>}
        </div>
      </div>
    </div>
  )
}
