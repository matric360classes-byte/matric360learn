"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const MATH_UNITS = ["Algebra","Functions & Graphs","Finance & Growth","Trigonometry","Euclidean Geometry","Analytical Geometry","Statistics","Calculus","Probability","Number Patterns"];
const PHYSICS_UNITS = ["Mechanics","Waves, Sound & Light","Electricity & Magnetism","Matter & Materials","Chemical Change","Chemical Systems"];

export default function VideosPage(){
  const [topics,setTopics]=useState<any[]>([]);
  const [videos,setVideos]=useState<any[]>([]);
  const [subject,setSubject]=useState("Mathematics");
  const [unit,setUnit]=useState("All units");
  const [topic,setTopic]=useState("All topics");
  const [q,setQ]=useState("");

  useEffect(()=>{ (async()=>{
    const {data:tData} = await supabase.from("topics").select("id,subject,caps_code,topic,paper_section").limit(2000);
    if(tData) setTopics(tData);
    const {data:vData} = await supabase.from("videos").select("*").order("created_at",{ascending:false}).limit(200);
    if(vData) setVideos(vData);
  })() },[]);

  const forSubj = topics.filter(t=> (t.subject||"").toLowerCase().includes(subject.slice(0,4).toLowerCase()));

  // Build units from DB, if empty use fallback - so NEVER empty
  let dbUnits: string[] = [];
  if(forSubj.length>0){
    const m:any={}; forSubj.forEach(t=>{ const u=t.paper_section||""; if(u) m[u]=1; });
    dbUnits = Object.keys(m);
  }
  const fallback = subject==="Mathematics"? MATH_UNITS : PHYSICS_UNITS;
  const units = ["All units",...(dbUnits.length>0? dbUnits : fallback)];

  const topicList = ["All topics",...forSubj.map(t=>t.caps_code).filter(Boolean).sort()];

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:14}}><span style={{color:"#00ff88",fontWeight:800,fontSize:12}}>Content Admin mode — {forSubj.length} topics loaded — Units: {units.length-1}</span></div>
      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between"}}><h1 style={{fontSize:24,fontWeight:900}}>Videos</h1><Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link></div>
      <div style={{padding:12,display:"grid",gap:10}}>
        <select value={subject} onChange={e=>{setSubject(e.target.value); setUnit("All units"); setTopic("All topics")}} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:14,color:"#fff"}}><option>Mathematics</option><option>Physical Sciences</option></select>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <select value={unit} onChange={e=>{setUnit(e.target.value); setTopic("All topics")}} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:14,color:"#fff"}}>{units.map(u=><option key={u} value={u}>{u}</option>)}</select>
          <select value={topic} onChange={e=>setTopic(e.target.value)} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:14,color:"#fff"}}>{topicList.map(t=><option key={t} value={t}>{t}</option>)}</select>
        </div>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:14,color:"#fff"}}/>
      </div>
      <div style={{margin:12,background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:12}}>
        {videos.filter(v=>!q || v.title?.toLowerCase().includes(q.toLowerCase())).map(v=>(
          <div key={v.id} style={{background:"#0e0f1a",border:"1px solid #1e2238",borderRadius:12,padding:10,display:"flex",gap:10,marginBottom:8}}><img src={v.thumbnail_url||`https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} style={{width:60,height:40,borderRadius:6}}/><div style={{flex:1}}><div style={{fontSize:12,fontWeight:700}}>{v.title}</div><div style={{fontSize:10,color:"#9aa0b3"}}>{v.caps_code}</div></div><Link href={`/admin/videos/${v.id}/edit`} style={{color:"#8b8bff"}}>Edit</Link></div>
        ))}
      </div>
    </div>
  )
}
