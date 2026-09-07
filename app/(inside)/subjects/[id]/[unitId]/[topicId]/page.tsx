"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const META = [
  { id:"A", label:"Exam Hook", icon:"📌" },
  { id:"B", label:"Learn The Concept", icon:"📚" },
  { id:"C", label:"Worked Example", icon:"📝" },
  { id:"D", label:"Examiner Traps", icon:"⚠️" },
  { id:"E", label:"Exam Challenge", icon:"🏆" },
];

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

  // EXACT match only - not includes()
  const clean = decodeURIComponent(topicId||"").toLowerCase().replace(/-/g," ").trim();
  const slug = (topicId||"").toLowerCase().trim();

  let topicRow = rows.find((r:any)=> (r.title||"").toLowerCase().trim()===clean || r.id===topicId || r.slug===slug);

  // If no exact row, find by title slug
  if(!topicRow) topicRow = rows.find((r:any)=> (r.title||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").includes(slug));

  // Parse content - your DB currently has JSON string like {"nodes":{...}}
  let realContent:any = {};
  try { realContent = typeof topicRow?.content === "string"? JSON.parse(topicRow.content) : topicRow?.content; } catch { realContent = topicRow?.content; }

  // Build 5 nodes - if DB has real lesson, use it, else show placeholder warning
  const hasRealData = topicRow && topicRow.node_title &&!JSON.stringify(topicRow).includes('"nodes":{"A"');

  // Get all node rows for this exact title (if you have 5 rows per title)
  const nodeRows = rows.filter((r:any)=> r.title && r.title.toLowerCase().trim()=== (topicRow?.title||"").toLowerCase().trim()).sort((a:any,b:any)=> (a.node_label||"").localeCompare(b.node_label||""));

  const displayNodes = nodeRows.length>=5? nodeRows : META.map(m=>{
    const found = nodeRows.find((n:any)=>n.node_label===m.id);
    return found || { node_label:m.id, node_title: realContent?.nodes?.[m.id] || m.label, content: `Real lesson for ${clean} - ${m.label} coming soon. Currently placeholder.`, title: clean, youtube_url: realContent?.youtube || "" };
  });

  const activeNode = displayNodes.find((n:any)=>n.node_label===active) || displayNodes[0];
  const meta = META.find(x=>x.id===active)!;

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#fff", paddingBottom:100}}>
      <div style={{padding:"12px 16px"}}>
        <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280", textDecoration:"none", fontSize:13}}>← Back</Link>
        <h1 style={{fontSize:22, fontWeight:900, marginTop:8}}>{topicRow?.title || clean.replace(/\b\w/g,(l:string)=>l.toUpperCase())}</h1>
        <p style={{fontSize:11, color: hasRealData?"#10b981":"#f59e0b"}}>{displayNodes.length} nodes • {hasRealData? "✅ Real data" : "⚠️ Placeholder data in DB - need to upload real lessons"} • {rows.length} loaded</p>
      </div>

      <div style={{display:"flex", gap:8, overflowX:"auto", padding:12}}>
        {META.map(m=>{
          const exists = displayNodes.some((d:any)=>d.node_label===m.id);
          return <button key={m.id} onClick={()=>setActive(m.id)} style={{padding:"10px 14px", borderRadius:20, background: active===m.id?"#fff":"#1a1c2e", color: active===m.id?"#000":"#fff", border:"1px solid #252a44", opacity: exists?1:0.4, whiteSpace:"nowrap", fontSize:13, fontWeight: active===m.id?700:400}}>{m.icon} {m.id}: {m.label}</button>
        })}
      </div>

      {activeNode && (
        <div style={{margin:12, background:"#1a1c2e", borderRadius:20, padding:16, border:"1px solid #252a44"}}>
          <div style={{fontWeight:800, marginBottom:8}}>{meta.icon} Node {activeNode.node_label} • {activeNode.node_title || meta.label}</div>

          {/* VIDEO HOLDER - HIDDEN BUT READY FOR UPLOAD */}
          <div style={{margin:"12px 0", borderRadius:12, background:"#000", padding:12, border:"1px dashed #333"}}>
            {activeNode.youtube_url && activeNode.youtube_url.startsWith("http")? (
              <iframe src={activeNode.youtube_url} style={{width:"100%", aspectRatio:"16/9", border:0, borderRadius:8}} allowFullScreen />
            ) : (
              <div style={{textAlign:"center", color:"#6b7280", fontSize:12, padding:"12px 0"}}>🎥 Video space ready - upload behind scenes<br/><span style={{fontSize:10, opacity:0.6}}>Add youtube_url in Supabase topic_knowledge row for {topicId} Node {active}</span></div>
            )}
          </div>

          <div style={{whiteSpace:"pre-wrap", fontSize:14, lineHeight:1.6, color:"#e5e7eb"}}>
            {typeof activeNode.content === "string" && activeNode.content.startsWith('{"nodes"')
             ? `⚠️ This topic still has placeholder JSON in Supabase.\n\nYou need to run: UPDATE topic_knowledge SET content='YOUR REAL LESSON' WHERE title='${clean}' AND node_label='${active}'\n\nCurrent placeholder: ${activeNode.content.slice(0,200)}...`
              : (activeNode.content || activeNode.summary || JSON.stringify(activeNode, null, 2))
            }
          </div>

          <div style={{display:"flex", gap:8, marginTop:20}}>
            <button onClick={()=>{const i=META.findIndex(x=>x.id===active); if(i>0) setActive(META[i-1].id)}} style={{padding:"10px 16px", borderRadius:20, background:"#252a44", color:"#fff"}}>← Prev</button>
            <button onClick={()=>{const i=META.findIndex(x=>x.id===active); if(i<4) setActive(META[i+1].id)}} style={{padding:"10px 16px", borderRadius:20, background:"#fff", color:"#000", marginLeft:"auto", fontWeight:700}}>Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
