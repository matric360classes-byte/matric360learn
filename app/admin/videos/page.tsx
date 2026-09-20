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
    const {data:kbData} = await supabase.from("caps_knowledge_base").select("id,subject,topic,caps_code,chapter,unit").limit(1000);
    if(kbData) setKb(kbData);
    const {data:vidData} = await supabase.from("videos").select("*").order("created_at",{ascending:false}).limit(200);
    if(vidData) setVideos(vidData);
  })() },[]);

  const units = ["All units",...Array.from(new Set(kb.filter(k=>k.subject?.toLowerCase().includes(subject.slice(0,4))).map(k=> k.unit || k.chapter || k.caps_code?.split("-")[0] || "General")))];

  const topicsForUnit = kb.filter(k=>{
    if(!k.subject?.toLowerCase().includes(subject.slice(0,4))) return false;
    if(unit==="All units") return true;
    const u = k.unit || k.chapter || k.caps_code?.split("-")[0] || "General";
    return u===unit;
  });

  const topicList = ["All topics",...Array.from(new Set(topicsForUnit.map(k=>k.caps_code)))];

  const filteredVideos = videos.filter(v=>{
    if(q &&!((v.title||"").toLowerCase().includes(q.toLowerCase()) || (v.youtube_id||"").includes(q))) return false;
    if(subject && v.subject &&!v.subject.toLowerCase().includes(subject.slice(0,4))) return false;
    if(unit!=="All units" && v.unit && v.unit!==unit) return false;
    if(topic!=="All topics" && v.caps_code && v.caps_code!==topic) return false;
    return true;
  });

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px"}}>
        <div style={{fontSize:13}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank.</div>
      </div>

      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{fontSize:28,fontWeight:900}}>Videos</h1>
        <Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"12px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link>
      </div>

      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {/* SUBJECT */}
        <select value={subject} onChange={e=>{setSubject(e.target.value); setUnit("All units"); setTopic("All topics")}} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",width:"100%"}}>
          <option value="mathematics">Mathematics</option>
          <option value="physical-sciences">Physical Sciences</option>
        </select>
        {/* UNITS - NOW POPULATED */}
        <select value={unit} onChange={e=>{setUnit(e.target.value); setTopic("All topics")}} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",width:"100%"}}>
          {units.map(u=><option key={u} value={u}>{u} {u!=="All units"? `(${topicsForUnit.filter(t=>(t.unit||t.chapter||t.caps_code?.split("-")[0])===u).length})` : ""}</option>)}
        </select>
        {/* TOPICS - NOW POPULATED */}
        <select value={topic} onChange={e=>setTopic(e.target.value)} style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",width:"100%"}}>
          {topicList.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title/URL" style={{background:"#151725",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",width:"100%"}}/>
      </div>

      <div style={{margin:"12px 16px",background:"#151725",border:"1px solid #1e2238",borderRadius:24,padding:12}}>
        {filteredVideos.length===0? <div style={{color:"#9aa0b3",padding:20,textAlign:"center"}}>No videos for {subject} / {unit} / {topic}.<br/>Click + Add video</div> :
          filteredVideos.map(v=>(
            <div key={v.id} style={{background:"#0e0f1a",border:"1px solid #1e2238",borderRadius:14,padding:12,display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
              <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/0.jpg`} style={{width:80,height:45,borderRadius:8,objectFit:"cover"}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.title || v.youtube_id}</div>
                <div style={{fontSize:11,color:"#9aa0b3"}}>{v.caps_code || v.topic || v.subject} • {v.youtube_id}</div>
              </div>
              <Link href={`/admin/videos/${v.id}/edit`} style={{background:"#1a1c2e",border:"1px solid #252a44",padding:"6px 12px",borderRadius:999,color:"#fff",textDecoration:"none",fontSize:12}}>Edit</Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}
