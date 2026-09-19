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
  if (!text) return <div style={{color:"#ff6b35"}}>No content field found</div>;
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
    if(!cleanNoDash) return;

    // STEP 1: Search caps_knowledge_base DIRECTLY on server for cubic - NOT in memory
    // This bypasses RLS issues and finds UNIT x | Cubic...
    let kb:any = null;
    const q1 = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,slug&topic=ilike.%${cleanNoDash}%&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    const r1 = await q1.json();
    kb = Array.isArray(r1)? r1[0] : null;

    // Fallback: try slug search
    if(!kb){
      const q2 = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,slug&slug=ilike.%${cleanId}%&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const r2 = await q2.json();
      kb = Array.isArray(r2)? r2[0] : null;
    }

    // Last fallback: fetch 200 and filter super loose
    if(!kb){
      const q3 = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,slug&limit=200`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const all:any = await q3.json();
      if(Array.isArray(all)){
        kb = all.find((k:any)=> (k.topic||"").toLowerCase().includes(cleanNoDash) );
      } else {
        console.log("CAPS_KB BLOCKED BY RLS", all);
      }
    }

    if(!kb){ console.log("0 TOPICS found for", cleanId); setRows([]); return; }

    // STEP 2: THIS IS THE 675 ALLOCATION - 5 nodes per topic id
    const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}&order=node_type.asc`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let nodes:any = await res.json();
    if(!Array.isArray(nodes)){ console.log("NODES BLOCKED",nodes); return; }
    console.log("GREEN - FOUND",nodes.length,"for",kb.topic,"ID",kb.id);

    const seen=new Set();
    nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
    setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
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
        <div style={{fontSize:12,color:rows.length?"#00ff88":"#ff6b35"}}>🔒 {rows.length} NODES • {rows[0]?.caps_topic_id?.slice(0,8)||clean} • {rows.length? "Allocated correctly":"Searching 135 topics..."}</div>
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
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {clean} from 135 topics... Open Console to see BLOCKED error</div>}
        </div>
      </div>
    </div>
  )
}
