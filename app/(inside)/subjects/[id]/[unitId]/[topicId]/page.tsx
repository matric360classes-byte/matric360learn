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
  if (!text) return <div>Empty</div>;
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
    return part.replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br/>');
  }).join('');
  return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.8',fontSize:'15px'}} />
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
    const subjectClean = decodeURIComponent(subjectId||"").toLowerCase().trim();

    // 1. GET ALL 135 TOPICS - NO SUBJECT FILTER IN SQL (fixes 0 NODES bug)
    const resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,slug,subject&limit=200`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let allKb:any = await resKb.json();
    if(!Array.isArray(allKb)){ console.log("KB BLOCKED",allKb); return; }

    // 2. FILTER BY SUBJECT IN MEMORY - fixes Physics under Maths
    // maths -> must have Mathematics in subject, physical -> Physical Sciences
    let subjectKeywords = subjectClean.includes("physical")? ["physical"] : subjectClean.includes("math")? ["math"] : [subjectClean.split("-")[0]];

    let filteredBySubject = allKb.filter((k:any)=>{
      const subj = (k.subject||"").toLowerCase();
      return subjectKeywords.some((sk:string)=> subj.includes(sk));
    });
    if(filteredBySubject.length===0) filteredBySubject = allKb; // fallback if subject column empty

    // 3. FIND THE TOPIC - trig equations matches Trigonometric Equations
    const words = cleanNoDash.split(" ").filter(w=>w.length>2);
    let kb = filteredBySubject.find((k:any)=>{
      const t=(k.topic||"").toLowerCase();
      return words.every((w:string)=> t.includes(w));
    }) || filteredBySubject.find((k:any)=> (k.topic||"").toLowerCase().includes(cleanNoDash))
      || filteredBySubject.find((k:any)=> (k.slug||"").toLowerCase()===cleanId);

    if(!kb){ console.log("Not found for",cleanNoDash,"tried in",filteredBySubject.length,"topics"); return; }

    // 4. 675 ALLOCATION - get its 5 nodes
    const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${kb.id}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let nodes:any = await res.json();
    console.log("FOUND",nodes.length,"for",kb.topic,kb.subject);
    const seen=new Set();
    nodes = nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]||n.node_type; if(seen.has(l)) return false; seen.add(l); return true;});
    setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]||n.node_type})));
  })()},[topicId, subjectId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];
  const getContent = (n:any)=> n?.content?.body_markdown || n?.body_markdown || n?.content?.body || n?.body || "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff"}}>
      <div style={{padding:16}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#888"}}>← Back</Link>
        <h1 style={{fontSize:24,fontWeight:900,textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12,color:rows.length?"#0f0":"#f55"}}>{rows.length} NODES • {rows[0]?.caps_topic_id?.slice(0,8)}</div>
      </div>
      <div style={{display:"flex",gap:8,padding:"0 12px 16px",overflowX:"auto"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{padding:"8px 16px",borderRadius:20,background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#aaa"}}>{k}</button>)}
      </div>
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:16,padding:16}}>
        <div style={{fontWeight:800,marginBottom:12}}>Node {active} • {meta?.label}</div>
        {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div>Loading {clean}...</div>}
      </div>
    </div>
  )
}
