"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const META:any = {
  A:{label:"Exam Hook", icon:"📌", desc:"Why this matters in exam", color:"#ff6b35"},
  B:{label:"Learn The Concept", icon:"📚", desc:"Core CAPS theory", color:"#3b82f6"},
  C:{label:"Worked Example", icon:"📝", desc:"Step-by-step", color:"#10b981"},
  D:{label:"Examiner Traps", icon:"⚠️", desc:"Where marks are lost", color:"#f59e0b"},
  E:{label:"Exam Challenge", icon:"🏆", desc:"Test yourself", color:"#8b5cf6"},
};

export default function Page({ params }: any){
  const p = useParams() as any;
  const subjectId = p?.id || params?.id;
  const unitId = p?.unitId || params?.unitId;
  const topicId = p?.topicId || params?.topicId;
  const [rows,setRows]=useState<any[]>([]);
  const [active,setActive]=useState("A");
  const [showVideo,setShowVideo]=useState(false);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    let all:any[]=[]; let from=0;
    while(true){
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`${from}-${from+999}`}
      });
      const chunk=await r.json(); if(!Array.isArray(chunk)||chunk.length===0) break;
      all=all.concat(chunk); if(chunk.length<1000) break; from+=1000; if(from>6000) break;
    }
    setRows(all);
  })()},[]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ").trim();
  const topicRow = rows.find((r:any)=> (r.title||"").toLowerCase().trim()===clean.toLowerCase()) || rows.find((r:any)=> (r.slug||"").toLowerCase()===topicId.toLowerCase());
  const nodeRows = rows.filter((r:any)=> r.title?.toLowerCase().trim()=== (topicRow?.title||clean).toLowerCase()).sort((a:any,b:any)=> (a.node_label||"").localeCompare(b.node_label||""));
  const displayNodes = nodeRows.length>=5? nodeRows : Object.keys(META).map(k=>{
    const f=nodeRows.find((n:any)=>n.node_label===k);
    return f||{node_label:k, node_title:META[k].label, content:"", title:clean, youtube_url:"", real_content:f?.real_content||f?.lesson_content};
  });
  const activeNode = displayNodes.find((n:any)=>n.node_label===active);
  const meta = META[active];

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#fff"}}>
      <div style={{padding:"16px"}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280", textDecoration:"none", fontSize:13}}>← Back</Link>
        <h1 style={{fontSize:28, fontWeight:900, margin:"8px 0 4px", textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12, color:"#6b7280"}}>5 nodes • {subjectId} / {unitId} • Tap to learn</div>
      </div>

      <div style={{display:"flex", gap:8, overflowX:"auto", padding:"0 12px 16px", scrollbarWidth:"none"}}>
        {Object.keys(META).map(k=>(
          <button key={k} onClick={()=>setActive(k)} style={{flexShrink:0, padding:"10px 16px", borderRadius:24, background: active===k? "#fff":"#1a1c2e", color: active===k?"#000":"#fff", border:"1px solid #252a44", fontSize:13, fontWeight: active===k?700:400, display:"flex", gap:6, alignItems:"center"}}><span>{META[k].icon}</span>{k}: {META[k].label}</button>
        ))}
      </div>

      <div style={{margin:"0 12px 100px", background:"#1a1c2e", borderRadius:24, border:"1px solid #252a44", overflow:"hidden"}}>
        <div style={{padding:16, borderBottom:"1px solid #252a44", display:"flex", gap:12, alignItems:"center"}}>
          <div style={{width:44, height:44, borderRadius:12, background:meta.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20}}>{meta.icon}</div>
          <div><div style={{fontWeight:800, fontSize:16}}>Node {active} • {activeNode?.node_title||meta.label}</div><div style={{fontSize:12, color:"#6b7280"}}>{meta.desc}</div></div>
        </div>

        {/* VIDEO - HIDDEN IF NO URL, SHOWS IF YOU ADD YOUTUBE_URL IN SUPABASE */}
        {activeNode?.youtube_url && activeNode.youtube_url.length>5? (
          <div style={{aspectRatio:"16/9", background:"#000"}}>
            <iframe src={activeNode.youtube_url.includes("youtube")? activeNode.youtube_url.replace("watch?v=","embed/") : activeNode.youtube_url} style={{width:"100%", height:"100%", border:0}} allowFullScreen />
          </div>
        ) : (
          <div onClick={()=>setShowVideo(!showVideo)} style={{background:"#0e0f1a", padding: showVideo?12:0, textAlign:"center", cursor:"pointer"}}>
            {showVideo && <div style={{fontSize:11, color:"#6b7280", padding:12, border:"1px dashed #333", borderRadius:12}}>🎥 Video slot ready<br/>Add youtube_url in Supabase: topic_knowledge WHERE title='{clean}' AND node_label='{active}'</div>}
          </div>
        )}

        <div style={{padding:20, lineHeight:1.7, fontSize:14, color:"#e5e7eb", minHeight:120}}>
          {activeNode?.content &&!activeNode.content.startsWith('{"nodes"') && activeNode.content.length>10? activeNode.content : (
            <div>
              <div style={{background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:"#fbbf24"}}>⚠️ Placeholder - Replace with real CAPS content for {clean} Node {active}</div>
              <div style={{opacity:0.6}}><b>Example structure for {meta.label}:</b><br/><br/>
              {active==="A"&& "🔥 Hook: Did you know electroplating is used for... (Exam loves to ask why we electroplate steel with zinc)... 2 marks in 2023 paper!"}
              {active==="B"&& "📚 Concept: Electroplating = using electrolysis to coat one metal with another...\nDefinition:...\nProcess: 1. Object = cathode 2. Metal to coat = anode 3. Electrolyte contains ions of coating metal"}
              {active==="C"&& "📝 Example: Calculate mass of copper deposited... Step 1: Q = It... Step 2: n(e-) = Q/F... Step 3:..."}
              {active==="D"&& "⚠️ Traps: 1. Learners swap anode/cathode 2. Forget to write half-reaction 3. Use Q=It incorrectly... Examiner report 2022: 60% lost marks here!"}
              {active==="E"&& "🏆 Challenge: A spoon is electroplated with silver... (a) What is electrolyte? (b) Write half-reaction at cathode... Try, then click Show Answer"}
              </div>
            </div>
          )}
        </div>

        <div style={{display:"flex", justifyContent:"space-between", padding:16, borderTop:"1px solid #252a44"}}>
          <button onClick={()=>{const ids=Object.keys(META); const i=ids.indexOf(active); if(i>0) setActive(ids[i-1])}} style={{padding:"10px 20px", borderRadius:20, background:"#252a44", color:"#fff", border:0}}>← Prev</button>
          <button onClick={()=>{const ids=Object.keys(META); const i=ids.indexOf(active); if(i<4) setActive(ids[i+1])}} style={{padding:"10px 20px", borderRadius:20, background:"#fff", color:"#000", border:0, fontWeight:700}}>Next →</button>
        </div>
      </div>
    </div>
  )
}
