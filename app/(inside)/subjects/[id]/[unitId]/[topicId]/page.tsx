"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const META:any = {
  A:{label:"Exam Hook", icon:"📌", desc:"Why this matters in exam", color:"#ff6b35"},
  B:{label:"Learn The Concept", icon:"📚", desc:"Core CAPS theory", color:"#3b82f6"},
  C:{label:"Worked Example", icon:"📝", desc:"Step-by-step", color:"#10b981"},
  D:{label:"Examiner Traps", icon:"⚠️", desc:"Where marks are lost", color:"#f59e0b"},
  E:{label:"Exam Challenge", icon:"🏆", desc:"Test yourself", color:"#8b5cf6"},
};

const TYPE_TO_LABEL:any = {
  EXAM_HOOK:"A",
  CONCEPT:"B",
  LEARN_THE_CONCEPT:"B",
  WORKED_EXAMPLE:"C",
  EXAMINER_TRAPS:"D",
  TRAPS:"D",
  EXAM_CHALLENGE:"E"
};

function MathRenderer({ text }: { text: string }) {
  if (!text) return null;
  let content = text.replace(/\*\*NODE.*?\*\*/g, '').replace(/###\s?/g, '\n');
  const regex = /(\\\[.*?\\\]|\\\(.*?\\\)|\$\$.*?\$\$|\$[^$]+?\$)/gs;
  const parts = content.split(regex);
  const html = parts.map(part => {
    if (!part) return '';
    const isBlock = (part.startsWith('\\[') && part.endsWith('\\]')) || (part.startsWith('$$') && part.endsWith('$$'));
    const isInline = (part.startsWith('\\(') && part.endsWith('\\)')) || (part.startsWith('$') && part.endsWith('$') && part.length>2);
    if (isBlock || isInline) {
      let math = part.slice(2,-2);
      if (part.startsWith('$') &&!part.startsWith('$$')) math = part.slice(1,-1);
      try { return katex.renderToString(math, { displayMode: isBlock, throwOnError: false }) } catch { return part }
    }
    return part.replace(/\*\*(.*?)\*\*/g, '<b style="color:#fff">$1</b>').replace(/\n/g, '<br/>');
  }).join('');
  return <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: '1.9', fontSize: '15px', color:'#e5e7eb' }} />
}

export default function Page({ params }: any){
  const p = useParams() as any;
  const subjectId = p?.id || params?.id;
  const unitId = p?.unitId || params?.unitId;
  const topicId = p?.topicId || params?.topicId;
  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState("A");

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    try{
      // LOCKED: Fetch directly from lesson_nodes - 675 perfect lessons
      const cleanId = decodeURIComponent(topicId||"").toLowerCase().trim();
      // Try 3 ways: topic_slug, caps_topic_id, id
      let nodes:any[] = [];

      let rn = await fetch(`${url}/rest/v1/lesson_nodes?select=*&topic_slug=eq.${cleanId}`, { headers:{apikey:key, Authorization:`Bearer ${key}`} });
      nodes = await rn.json();

      if(!Array.isArray(nodes) || nodes.length===0){
        rn = await fetch(`${url}/rest/v1/lesson_nodes?select=*&caps_topic_id=eq.${cleanId}`, { headers:{apikey:key, Authorization:`Bearer ${key}`} });
        nodes = await rn.json();
      }
      if(!Array.isArray(nodes) || nodes.length===0){
        // ilike search for slug
        rn = await fetch(`${url}/rest/v1/lesson_nodes?select=*`, { headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`0-999`} });
        const all = await rn.json();
        if(Array.isArray(all)){
          nodes = all.filter((n:any)=>
            (n.topic_slug||"").toLowerCase()===cleanId ||
            (n.caps_topic_id||"").toLowerCase()===cleanId ||
            (n.topic_slug||"").toLowerCase().includes(cleanId) ||
            (n.title||"").toLowerCase().includes(cleanId.replace(/-/g," "))
          ).slice(0,5);
        }
      }

      if(Array.isArray(nodes) && nodes.length>0){
        // Add node_label A-E mapping
        const mapped = nodes.map((n:any)=>{
          const label = TYPE_TO_LABEL[n.node_type] || n.node_label || "A";
          return {...n, node_label:label, _orig_type:n.node_type};
        });
        setRows(mapped);
      }
    }catch(e){ console.log(e) }
  })()},[topicId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ").trim();
  const displayNodes = rows.length>=1? rows : Object.keys(META).map(k=>({node_label:k, node_title:META[k].label, content:"", title:clean, _empty:true}));
  const activeNode = displayNodes.find((n:any)=>n.node_label===active);
  const meta = META[active];

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#fff"}}>
      <div style={{padding:"16px"}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280", textDecoration:"none", fontSize:"14px"}}>← Back</Link>
        <h1 style={{fontSize:28, fontWeight:900, margin:"8px 0 4px", textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12, color:"#6b7280"}}>{rows.length===5? "🔒 5 real nodes • LOCKED" : `${rows.length} nodes`} • {subjectId} / {unitId} • Tap to learn</div>
      </div>

      <div style={{display:"flex", gap:8, overflowX:"auto", padding:"0 12px 16px", scrollbarWidth:"none"}}>
        {Object.keys(META).map(k=>(
          <button key={k} onClick={()=>setActive(k)} style={{flexShrink:0, padding:"10px 18px", borderRadius:"24px", border:"1px solid #252a44", background: active===k? "#fff":"#1a1c2e", color: active===k? "#000":"#9ca3af", fontWeight: active===k?700:500, cursor:"pointer"}}>
            {META[k].icon} {k}: {META[k].label}
          </button>
        ))}
      </div>

      <div style={{margin:"0 12px 100px", background:"#1a1c2e", borderRadius:24, border:"1px solid #252a44", overflow:"hidden"}}>
        <div style={{padding:16, borderBottom:"1px solid #252a44", display:"flex", gap:12, alignItems:"center"}}>
          <div style={{width:44, height:44, borderRadius:12, background:meta.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20}}>{meta.icon}</div>
          <div><div style={{fontWeight:800, fontSize:16}}>Node {active} • {meta.label}</div><div style={{fontSize:12, color:"#6b7280"}}>{meta.desc}</div></div>
        </div>

        <div style={{padding:20, lineHeight:1.7, fontSize:14, color:"#e5e7eb", minHeight:200}}>
          {activeNode &&!activeNode._empty? (
            <MathRenderer text={typeof activeNode.content === 'string'? activeNode.content : activeNode.content?.body_markdown || activeNode.content?.body || activeNode.content?.markdown || JSON.stringify(activeNode.content)} />
          ) : (
            <div>
              <div style={{background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", padding:12, borderRadius:10, color:"#fbbf24", marginBottom:12}}>
                ⚠️ No lesson_nodes found for "{topicId}" - checking {clean}. This should show 🔒 LOCKED nodes after fix.
              </div>
              <div style={{opacity:0.6}}><b>Example structure for {meta.label}:</b><br/><br/>
                {active==="A"&& "🔥 Hook: Did you know..."}
                {active==="B"&& "📚 Concept:..."}
                {active==="C"&& "📝 Example:..."}
                {active==="D"&& "⚠️ Traps:..."}
                {active==="E"&& "🏆 Challenge:..."}
              </div>
            </div>
          )}
        </div>

        <div style={{display:"flex", justifyContent:"space-between", padding:16, borderTop:"1px solid #252a44"}}>
          <button onClick={()=>{const ids=Object.keys(META); const i=ids.indexOf(active); if(i>0) setActive(ids[i-1])}} style={{padding:"10px 18px", borderRadius:"24px", border:"none", background:"#252a44", color:"#fff", cursor:"pointer"}}>← Prev</button>
          <button onClick={()=>{const ids=Object.keys(META); const i=ids.indexOf(active); if(i<4) setActive(ids[i+1])}} style={{padding:"10px 18px", borderRadius:"24px", border:"none", background:"#fff", color:"#000", fontWeight:700, cursor:"pointer"}}>Next →</button>
        </div>
      </div>
    </div>
  )
}
