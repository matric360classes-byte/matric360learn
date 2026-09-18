"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';

// READ ONLY META - A-E = your 5 locked nodes
const META:any = {
  A:{label:"Exam Hook", icon:"📌", color:"#ff6b35"},
  B:{label:"Learn The Concept", icon:"📚", color:"#3b82f6"},
  C:{label:"Worked Example", icon:"📝", color:"#10b981"},
  D:{label:"Examiner Traps", icon:"⚠️", color:"#f59e0b"},
  E:{label:"Exam Challenge", icon:"🏆", color:"#8b5cf6"},
};
const TYPE_TO_LABEL:any = { EXAM_HOOK:"A", CONCEPT:"B", LEARN_THE_CONCEPT:"B", WORKED_EXAMPLE:"C", EXAMINER_TRAPS:"D", TRAPS:"D", EXAM_CHALLENGE:"E" };

function MathRenderer({ text }: { text: string }) {
  if (!text) return null;
  let content = text.replace(/\*\*NODE.*?\*\*/g,'');
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs;
  const parts = content.split(regex);
  const html = parts.map(part=>{
    if(!part) return '';
    const isBlock = (part.startsWith('\\[')&&part.endsWith('\\]')) || (part.startsWith('$$')&&part.endsWith('$$'));
    const isInline = (part.startsWith('\\(')&&part.endsWith('\\)')) || (part.startsWith('$')&&part.endsWith('$')&&part.length>2);
    if(isBlock||isInline){
      let math = part.slice(2,-2); if(part.startsWith('$')&&!part.startsWith('$$')) math = part.slice(1,-1);
      try{ return katex.renderToString(math,{displayMode:isBlock,throwOnError:false}) }catch{return part}
    }
    return part.replace(/\*\*(.*?)\*\*/g,'<b style="color:#fff">$1</b>').replace(/\n/g,'<br/>');
  }).join('');
  return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.9',fontSize:'15px',color:'#e5e7eb'}} />
}

export default function Page(){
  const p = useParams() as any;
  const subjectId = p?.id, unitId = p?.unitId, topicId = p?.topicId;
  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const cleanId = decodeURIComponent(topicId||"").toLowerCase().trim();
    // READ ONLY FETCH - NEVER WRITES TO lesson_nodes
    try{
      const res = await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const all = await res.json();
      if(!Array.isArray(all)){ console.log("BLOCKED",all); return; }
      let nodes = all.filter((n:any)=>{
        const slug=(n.topic_slug||"").toLowerCase();
        const title=(n.title||"").toLowerCase();
        return slug===cleanId || slug.includes(cleanId) || cleanId.includes(slug) || title.includes(cleanId.replace(/-/g," "));
      });
      const order=["EXAM_HOOK","CONCEPT","LEARN_THE_CONCEPT","WORKED_EXAMPLE","EXAMINER_TRAPS","TRAPS","EXAM_CHALLENGE"];
      nodes = nodes.sort((a:any,b:any)=>order.indexOf(a.node_type)-order.indexOf(b.node_type));
      const seen=new Set(); nodes=nodes.filter((n:any)=>{const l=TYPE_TO_LABEL[n.node_type]; if(seen.has(l)) return false; seen.add(l); return true;}).slice(0,5);
      setRows(nodes.map((n:any)=>({...n,node_label:TYPE_TO_LABEL[n.node_type]})));
    }catch(e){console.log(e)}
  })()},[topicId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((n:any)=>n.node_label===active);
  const meta = META[active];

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back</Link>
        <h1 style={{fontSize:26,fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12,color:rows.length? "#00ff88":"#f59e0b"}}>{rows.length? `🔒 ${rows.length} LOCKED NODES • ${rows[0]?.topic_slug} • Perfect formulas` : "Loading locked nodes..."}</div>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=><button key={k} onClick={()=>setActive(k)} style={{padding:"10px 18px",borderRadius:24,border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500}}>{META[k].icon} {k}</button>)}
      </div>
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:24,border:"1px solid #252a44"}}>
        <div style={{padding:16,borderBottom:"1px solid #252a44",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:12,background:meta.color,display:"flex",alignItems:"center",justifyContent:"center"}}>{meta.icon}</div>
          <div><div style={{fontWeight:800}}>Node {active} • {meta.label}</div><div style={{fontSize:12,color:"#6b7280"}}>From your 675 locked perfect lessons</div></div>
        </div>
        <div style={{padding:20,minHeight:200}}>
          {activeNode? <MathRenderer text={typeof activeNode.content==='string'? activeNode.content : activeNode.content?.body_markdown || activeNode.content?.body || ""} /> : <div style={{color:"#888"}}>Loading {clean}... {rows.length} nodes found</div>}
        </div>
      </div>
    </div>
  )
}
