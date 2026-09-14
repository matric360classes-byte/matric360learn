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
  const [parts,setParts]=useState<any[]>([]);
  const [active,setActive]=useState("A");
  const [showVideo,setShowVideo]=useState(false);

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    // OLD table
    let all:any[]=[]; let from=0;
    while(true){
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`${from}-${from+999}`}
      });
      const chunk=await r.json(); if(!Array.isArray(chunk)||chunk.length===0) break;
      all=all.concat(chunk); if(chunk.length<1000) break; from+=1000; if(from>6000) break;
    }
    setRows(all);
    // NEW tables lesson_nodes + lesson_parts
    try{
      const rn = await fetch(`${url}/rest/v1/lesson_nodes?select=*`,{ headers:{apikey:key, Authorization:`Bearer ${key}`} });
      const nodes = await rn.json();
      const cleanId = decodeURIComponent(topicId||"").toLowerCase();
      const parent = nodes.find((n:any)=> (n.node_label||"").toLowerCase()===cleanId || (n.title||"").toLowerCase().trim()===decodeURIComponent(topicId||"").replace(/-/g," ").toLowerCase().trim());
      if(parent?.id){
        const rp = await fetch(`${url}/rest/v1/lesson_parts?parent_node_id=eq.${parent.id}&select=*&order=sort_order.asc`,{ headers:{apikey:key, Authorization:`Bearer ${key}`} });
        const pRows = await rp.json();
        if(Array.isArray(pRows)) setParts(pRows);
      }
    }catch{}
  })()},[topicId]);

  const clean = decodeURIComponent(topicId||"").replace(/-/g," ").trim();
  const topicRow = rows.find((r:any)=> (r.title||"").toLowerCase().trim()===clean.toLowerCase()) || rows.find((r:any)=> (r.slug||"").toLowerCase()===topicId.toLowerCase());
  const nodeRows = rows.filter((r:any)=> r.title?.toLowerCase().trim()=== (topicRow?.title||clean).toLowerCase()).sort((a:any,b:any)=> (a.node_label||"").localeCompare(b.node_label||""));
  const displayNodes = nodeRows.length>=5? nodeRows : Object.keys(META).map(k=>{
    const f=nodeRows.find((n:any)=>n.node_label===k);
    return f||{node_label:k, node_title:META[k].label, content:"", title:clean, youtube_url:"", real_content:f?.real_content||f?.lesson_content};
  });
  const activeNode = displayNodes.find((n:any)=>n.node_label===active);
  const activePart = parts.find((pr:any)=>pr.node_key===active);
  const meta = META[active];

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#fff"}}>
      <div style={{padding:"16px"}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280", textDecoration:"none", fontSize:13}}>← Back</Link>
        <h1 style={{fontSize:28, fontWeight:900, margin:"8px 0 4px", textTransform:"capitalize"}}>{clean}</h1>
        <div style={{fontSize:12, color:"#6b7280"}}>{parts.length===5? "5 real nodes" : "5 nodes"} • {subjectId} / {unitId} • Tap to learn</div>
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
          {activePart ? (
            <div>
              {(() => {
                const j = activePart.content_json || {};
                return (
                  <>
                    {j.type==="exam_hook" && (
                      <>
                        <div style={{display:"flex", flexWrap:"wrap", gap:6, marginBottom:12}}>{(j.key_terms||[]).map((t:any,i:number)=><span key={i} style={{background:"#2a2d4a", padding:"4px 10px", borderRadius:20, fontSize:11}}>{t}</span>)}</div>
                        <div style={{marginBottom:12}}>{j.core_concepts}</div>
                        <div style={{fontSize:11, color:"#fbbf24", background:"rgba(251,191,36,0.1)", padding:8, borderRadius:8}}>{j.dbe_context}</div>
                      </>
                    )}
                    {(j.type==="learn_concept" || j.type==="worked_example") && (
                      <>
                        <div style={{fontWeight:800, marginBottom:12, color:"#fff"}}>Q: {j.question}</div>
                        {(j.steps||[]).map((s:any,i:number)=><div key={i} style={{marginBottom:8, background:"#0e0f1a", padding:"10px 12px", borderRadius:10, borderLeft:`3px solid ${meta.color}`}}><b>Step {i+1}:</b> {typeof s==="string"? s : s.text}</div>)}
                        {j.examiner_note && <div style={{marginTop:10, fontSize:12, color:"#fbbf24"}}>💡 {j.examiner_note}</div>}
                        <div style={{marginTop:14, padding:12, background:"#065f46", borderRadius:10, fontWeight:700}}>FINAL ANSWER: {j.final_answer}</div>
                      </>
                    )}
                    {j.type==="exam_traps" && (
                      <>
                        <div style={{background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.4)", padding:12, borderRadius:10, marginBottom:12}}>❌ COMMON ERROR: {j.common_error}</div>
                        {(j.examiner_tips||[]).map((t:any,i:number)=><div key={i} style={{marginBottom:8, fontSize:13}}>• {typeof t==="string"? t : t.title? `${t.title}: ${t.attack}` : t}</div>)}
                        {(j.interpretation||[]).length>0 && <div style={{marginTop:10}}><b>Interpretation:</b><br/>{j.interpretation.map((x:any,i:number)=><div key={i}>- {x}</div>)}</div>}
                        {j.time && <div style={{marginTop:10, fontSize:12, color:"#9ca3af"}}>⏱ {j.time}</div>}
                      </>
                    )}
                    {j.type==="exam_challenge" && (
                      <>
                        {(j.formulas||[]).map((f:any,i:number)=><div key={i} style={{background:"#0e0f1a", padding:"10px 12px", borderRadius:10, marginBottom:8, border:"1px solid #252a44"}}><div style={{fontFamily:"monospace", fontWeight:700, color:"#fbbf24"}}>{f.formula||f.f}</div><div style={{fontSize:11, color:"#9ca3af"}}>{f.when||f.w}</div></div>)}
                        {j.key_facts && <div style={{marginTop:12}}><b>Key Facts:</b>{j.key_facts.map((k:any,i:number)=><div key={i} style={{fontSize:12}}>• {k}</div>)}</div>}
                        {j.quick_notes && <div style={{marginTop:12, padding:10, background:"#1f2937", borderRadius:10, fontStyle:"italic", fontSize:12}}>{j.quick_notes}</div>}
                      </>
                    )}
                  </>
                )
              })()}
            </div>
          ) : (
            activeNode?.content &&!activeNode.content.startsWith('{"nodes"') && activeNode.content.length>10? activeNode.content : (
              <div>
                <div style={{background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:12, padding:12, marginBottom:16, fontSize:12, color:"#fbbf24"}}>⚠️ Placeholder - Replace with real CAPS content for {clean} Node {active} {parts.length===0? "(No lesson_parts found - add in Supabase)":""}</div>
                <div style={{opacity:0.6}}><b>Example structure for {meta.label}:</b><br/><br/>
                {active==="A"&& "🔥 Hook: Did you know..."}
                {active==="B"&& "📚 Concept:..."}
                {active==="C"&& "📝 Example:..."}
                {active==="D"&& "⚠️ Traps:..."}
                {active==="E"&& "🏆 Challenge:..."}
                </div>
              </div>
            )
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
