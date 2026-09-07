"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const NODES_META = [
  { id:"A", label:"Exam Hook", icon:"📌", color:"#ff6b35" },
  { id:"B", label:"Learn The Concept", icon:"📚", color:"#3b82f6" },
  { id:"C", label:"Worked Example", icon:"📝", color:"#10b981" },
  { id:"D", label:"Examiner Traps", icon:"⚠️", color:"#f59e0b" },
  { id:"E", label:"Exam Challenge", icon:"🏆", color:"#8b5cf6" },
];

export default function Page({ params }: any){
  const p = useParams() as any;
  const subjectId = (p?.id || params?.id) as string;
  const unitId = (p?.unitId || params?.unitId) as string;
  const topicId = (p?.topicId || params?.topicId) as string;

  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState(0);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    let all:any[]=[]; let from=0;
    while(true){
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*&order=title.asc`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`${from}-${from+999}`}
      });
      const chunk=await r.json();
      if(!Array.isArray(chunk)||chunk.length===0) break;
      all=all.concat(chunk);
      if(chunk.length<1000) break;
      from+=1000; if(from>6000) break;
    }
    setRows(all); setLoading(false);
  })()},[]);

  // Match real lessons: try to match by topicId -> title
  const cleanTopic = decodeURIComponent(topicId||"").replace(/-/g," ").toLowerCase();
  const matched = rows.filter((r:any)=>{
    const title = (r.title||"").toLowerCase();
    return title===cleanTopic || title.includes(cleanTopic) || title.includes((topicId||"").toLowerCase()) || r.topic_id===topicId;
  }).sort((a:any,b:any)=> (a.node_label||"").localeCompare(b.node_label||""));

  // If still no match, get by subject
  const fallback = matched.length>0 ? matched : rows.filter((r:any)=>r.subject===subjectId || r.subject==="physical-sciences" || r.subject==="mathematics").slice(0,5);
  const displayNodes = matched.length>0 ? matched : fallback;
  const node = displayNodes[active] || displayNodes[0];
  const meta = NODES_META[active];

  if(loading) return <div style={{padding:20, background:"#0e0f1a", color:"#fff", minHeight:"100vh"}}>Loading {rows.length} lessons...</div>;

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#fff", paddingBottom:100}}>
      <div style={{padding:"12px 16px 0", fontSize:13, color:"#6b7280", display:"flex", gap:6}}>
        <Link href="/subjects" style={{color:"#6b7280", textDecoration:"none"}}>Subjects</Link> {" / "}
        <Link href={`/subjects/${subjectId}`} style={{color:"#6b7280", textDecoration:"none"}}>{subjectId}</Link> {" / "}
        <span style={{color:"#e5e7eb"}}>{decodeURIComponent(topicId||"")}</span>
      </div>

      <h1 style={{fontSize:24, fontWeight:900, padding:"8px 16px 2px", lineHeight:1.2}}>{node?.node_title || decodeURIComponent(topicId||"").replace(/\b\w/g,(l:string)=>l.toUpperCase())}</h1>
      <p style={{fontSize:11, color:"#6b7280", padding:"0 16px 12px"}}>{displayNodes.length} nodes • {subjectId} / {unitId} • {rows.length} total loaded</p>

      {/* Node Tabs - NOW SHOWS ALL 5 WITH REAL CHECK */}
      <div style={{display:"flex", gap:8, overflowX:"auto", padding:"0 12px 12px"}}>
        {NODES_META.map((n,i)=>{
          const exists = displayNodes.some((d:any)=>d.node_label===n.id);
          return(
            <button key={n.id} onClick={()=>setActive(i)} style={{
              padding:"10px 14px", borderRadius:20, border:"1px solid #252a44",
              background: active===i ? "#fff" : "#1a1c2e", color: active===i ? "#000" : "#fff",
              opacity: exists?1:0.35, fontSize:13, whiteSpace:"nowrap", fontWeight: active===i?700:400
            }}>{n.icon} {n.id}: {n.label} {exists?"✓":""}</button>
          )
        })}
      </div>

      {node ? (
        <div style={{margin:"0 12px", background:"#1a1c2e", borderRadius:20, padding:16, border:"1px solid #252a44"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:12}}>
            <div style={{width:36, height:36, borderRadius:10, background:meta.color, display:"flex", alignItems:"center", justifyContent:"center"}}>{meta.icon}</div>
            <div><div style={{fontWeight:800}}>Node {node.node_label} • {node.node_title || meta.label}</div><div style={{fontSize:11, color:"#6b7280"}}>{meta.label}</div></div>
          </div>

          <div style={{whiteSpace:"pre-wrap", fontSize:14, lineHeight:1.6, color:"#e5e7eb"}}>
            {node.content || node.summary || node.body || `Real CAPS content for ${node.title} - Node ${node.node_label}`}
          </div>

          {node.youtube_url && !node.youtube_url.includes("{topicId}") && (
            <div style={{marginTop:12, aspectRatio:"16/9", background:"#000", borderRadius:12, overflow:"hidden"}}>
              <iframe src={node.youtube_url} style={{width:"100%", height:"100%", border:0}} allowFullScreen />
            </div>
          )}

          <div style={{display:"flex", gap:8, marginTop:20}}>
            <button onClick={()=>setActive(Math.max(0,active-1))} style={{padding:"10px 16px", borderRadius:20, background:"#252a5a", color:"#fff"}}>← Prev</button>
            <button onClick={()=>setActive(Math.min(4,active+1))} style={{padding:"10px 16px", borderRadius:20, background:"#fff", color:"#000", marginLeft:"auto", fontWeight:700}}>Next →</button>
          </div>
        </div>
      ) : (
        <div style={{padding:20, color:"#ff6b6b"}}>No match for "{topicId}" in {rows.length} lessons. Try {cleanTopic}</div>
      )}
    </div>
  )
}
