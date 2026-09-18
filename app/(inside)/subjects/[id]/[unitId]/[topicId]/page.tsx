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
  if (!text) return <div style={{color:"#ff6b35", fontSize:13}}>No content in row - check Supabase console</div>;
  let content = text;
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs;
  const parts = content.split(regex);
  const html = parts.map(part=>{
    if(!part) return '';
    const isBlock = (part.startsWith('\\[')&&part.endsWith('\\]')) || (part.startsWith('$$')&&part.endsWith('$$'));
    const isInline = (part.startsWith('\\(')&&part.endsWith('\\)')) || (part.startsWith('$')&&part.endsWith('$')&&part.length>2);
    if(isBlock||isInline){
      let math = part.slice(2,-2);
      if(part.startsWith('$') &&!part.startsWith('$$')) math = part.slice(1,-1);
      try{ return katex.renderToString(math,{displayMode:isBlock,throwOnError:false}) }catch{return `<span>${part}</span>`}
    }
    return part.replace(/\*\*(.*?)\*\*/g,'<b style="color:#fff">$1</b>').replace(/\n/g,'<br/>');
  }).join('');
  return <div dangerouslySetInnerHTML={{__html:html}} style={{lineHeight:'1.9',fontSize:'15px',color:'#e5e7eb'}} />
}

export default function Page(){
  const p = useParams() as any;
  const subjectId = p?.id;
  const unitId = p?.unitId;
  const topicId = p?.topicId;
  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{(async()=>{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const cleanId = decodeURIComponent(topicId||"").toLowerCase().trim();
    try{
      // READ ONLY - gets exactly your 5 locked nodes
      const res = await fetch(`${url}/rest/v1/lesson_nodes?topic_slug=eq.${cleanId}&select=*`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      let nodes:any = await res.json();
      if(!Array.isArray(nodes) || nodes.length===0){
        const res2 = await fetch(`${url}/rest/v1/lesson_nodes?topic_slug=ilike.%25${cleanId}%25&select=*&limit=20`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
        nodes = await res2.json();
      }
      if(!Array.isArray(nodes)) { console.log("READ BLOCKED:", nodes); return; }
      console.log("LOCKED ROWS:", nodes);
      const order=["EXAM_HOOK","CONCEPT","LEARN_THE_CONCEPT","WORKED_EXAMPLE","EXAMINER_TRAPS","TRAPS","EXAM_CHALLENGE"];
      nodes = nodes.sort((a:any,b:any)=>order.indexOf(a.node_type)-order.indexOf(b.node_type));
      // Keep 1 per A-E
      const seen=new Set();
      nodes = nodes.filter((n:any)=>{
        const l = TYPE_TO_LABEL[n.node_type] || n.node_label;
        if(seen.has(l)) return false;
        seen.add(l);
        return true;
      });
      setRows(nodes.map((n:any)=>({...n, node_label: TYPE_TO_LABEL[n.node_type] || n.node_label || "A"})));
    }catch(e){ console.log(e) }
  })()},[topicId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ");
  const activeNode = rows.find((r:any)=>r.node_label===active) || rows[0];
  const meta = META[active];

  const getContent = (n:any)=>{
    if(!n) return "";
    // Your locked column is content (jsonb) -> body_markdown
    return n.content?.body_markdown || n.body_markdown || n.content?.body || n.body || n.content?.markdown || n.markdown || (typeof n.content==='string'? n.content : "") || "";
  };

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{padding:16}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back</Link>
        <h1 style={{fontSize:26,fontWeight:900,margin:"8px 0",textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12,color:"#00ff88"}}>🔒 {rows.length} LOCKED • {rows[0]?.topic_slug || clean} • Perfect formulas locked</div>
      </div>
      <div style={{display:"flex",gap:8,overflowX:"auto",padding:"0 12px 16px"}}>
        {Object.keys(META).map(k=>(
          <button key={k} onClick={()=>setActive(k)} style={{flexShrink:0, padding:"10px 18px",borderRadius:24,border:"1px solid #252a44",background:active===k?"#fff":"#1a1c2e",color:active===k?"#000":"#9ca3af",fontWeight:active===k?700:500,cursor:"pointer"}}>
            {META[k].icon} {k}
          </button>
        ))}
      </div>
      <div style={{margin:"0 12px",background:"#1a1c2e",borderRadius:24,border:"1px solid #252a44",overflow:"hidden"}}>
        <div style={{padding:16,borderBottom:"1px solid #252a44",display:"flex",gap:12,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:12,background:meta?.color||"#3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{meta?.icon}</div>
          <div><div style={{fontWeight:800}}>Node {active} • {meta?.label}</div><div style={{fontSize:11,color:"#6b7280"}}>From 675 locked perfect lessons • {activeNode?.node_type}</div></div>
        </div>
        <div style={{padding:20,minHeight:250}}>
          {activeNode? <MathRenderer text={getContent(activeNode)} /> : <div style={{color:"#888"}}>Loading {rows.length} locked nodes...</div>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",padding:16,borderTop:"1px solid #252a44"}}>
          <button onClick={()=>{const ids=Object.keys(META); const i=ids.indexOf(active); if(i>0) setActive(ids[i-1])}} style={{padding:"10px 18px",borderRadius:24,border:"none",background:"#252a44",color:"#fff",cursor:"pointer"}}>← Prev</button>
          <button onClick={()=>{const ids=Object.keys(META); const i=ids.indexOf(active); if(i<4) setActive(ids[i+1])}} style={{padding:"10px 18px",borderRadius:24,border:"none",background:"#fff",color:"#000",fontWeight:700,cursor:"pointer"}}>Next →</button>
        </div>
      </div>
    </div>
  )
}
