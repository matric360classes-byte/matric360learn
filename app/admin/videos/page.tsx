"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function VideosPage(){
  const [kb,setKb]=useState<any[]>([]);
  const [videos,setVideos]=useState<any[]>([]);
  const [subject,setSubject]=useState("mathematics");
  const [unit,setUnit]=useState("All units");
  const [topic,setTopic]=useState("All topics");
  const [q,setQ]=useState("");

  useEffect(()=>{ (async()=>{
    const {data:kbData} = await supabase.from("caps_knowledge_base").select("id,subject,topic,caps_code").limit(1000);
    if(kbData) setKb(kbData);
    const {data:vidData} = await supabase.from("videos").select("*").order("created_at",{ascending:false}).limit(200);
    if(vidData) setVideos(vidData);
  })() },[]);

  const kbForSubj = kb.filter(k=>k.subject?.toLowerCase().includes(subject.slice(0,4)));
  const unitsMap:any={};
  kbForSubj.forEach(k=>{
    const u = (k.caps_code||"").split("-")[0] || "general";
    unitsMap[u]=(unitsMap[u]||0)+1;
  });
  const units = ["All units",...Object.keys(unitsMap).sort()];

  const topicsForUnit = kbForSubj.filter(k=>{
    if(unit==="All units") return true;
    return (k.caps_code||"").startsWith(unit);
  });
  const topicList = ["All topics",...Array.from(new Set(topicsForUnit.map(k=>k.caps_code))).sort()];

  const filtered = videos.filter(v=>{
    if(q &&!(v.title||"").toLowerCase().includes(q.toLowerCase()) &&!(v.youtube_id||"").includes(q)) return false;
    if(subject && v.subject &&!v.subject.toLowerCase().includes(subject.slice(0,4))) return false;
    if(unit!=="All units" && v.caps_code &&!v.caps_code.startsWith(unit)) return false;
    if(topic!=="All topics" && v.caps_code && v.caps_code!==topic) return false;
    return true;
  });

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",display:"flex",justifyContent:"space-between"}}>
        <div style={{fontSize:13}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank.</div>
        <Link href="/admin" style={{color:"#9aa0b3",textDecoration:"none"}}>✕</Link>
      </div>
      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{fontSize:26,fontWeight:900}}>Videos</h1>
        <Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link>
      </div>
      <div style={{padding:"12px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <select value={subject} onChange={e=>{setSubject(e.target.value); setUnit("All units"); setTopic("All topics")}} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",gridColumn:"1 / -1"}}>
          <option value="mathematics">Mathematics</option><option value="physical-sciences">Physical Sciences</option>
        </select>
        <select value={unit} onChange={e=>{setUnit(e.target.value); setTopic("All topics")}} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}>
          {units.map(u=><option key={u} value={u}>{u} {unitsMap[u]?`(${unitsMap[u]})`:""}</option>)}
        </select>
        <select value={topic} onChange={e=>setTopic(e.target.value)} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}>
          {topicList.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Search title/URL" style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",gridColumn:"1 / -1"}}/>
      </div>
      <div style={{margin:"0 16px",background:"#151725",border:"1px solid #1e2238",borderRadius:20,padding:12}}>
        {filtered.length===0? <div style={{color:"#9aa0b3",padding:30,textAlign:"center"}}>No videos for {subject} / {unit} / {topic}</div> :
          filtered.map(v=><div key={v.id} style={{background:"#0e0f1a",border:"1px solid #1e2238",borderRadius:12,padding:10,display:"flex",gap:10,marginBottom:8}}>
            <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`} style={{width:70,height:44,borderRadius:8}}/>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12}}>{v.title||v.youtube_id}</div><div style={{fontSize:10,color:"#9aa0b3"}}>{v.caps_code} • {v.youtube_id}</div></div>
            <Link href={`/admin/videos/${v.id}/edit`} style={{color:"#8b8bff",fontSize:12,textDecoration:"none"}}>Edit</Link>
          </div>)}
      </div>
    </div>
  )
}
