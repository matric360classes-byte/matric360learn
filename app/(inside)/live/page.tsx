"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const WA = "27729888561";

type Lesson = {
  id: string;
  subject: string;
  topic: string;
  start_time: string;
  duration_minutes: number;
  status: "live" | "upcoming" | "recorded";
  meet_link: string;
  recording_link: string;
};

export default function LivePage(){
  const [lessons,setLessons]=useState<Lesson[]>([]);
  const [tab,setTab]=useState<"upcoming"|"recorded">("upcoming");

  useEffect(()=>{
    (async()=>{
      const supabase = createClient();
      const { data } = await supabase.from("live_lessons").select("*").order("start_time",{ascending:false});
      if(data) setLessons(data as any);
    })();
  },[]);

  const liveNow = lessons.filter(l=>l.status==="live");
  const upcoming = lessons.filter(l=>l.status==="upcoming");
  const recorded = lessons.filter(l=>l.status==="recorded");

  const fmt = (iso:string) => new Date(iso).toLocaleString("en-ZA",{weekday:"short", day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"});

  const waLink = (topic:string) => `https://wa.me/${WA}?text=${encodeURIComponent(`Hi Tutor, notify me for: ${topic}`)}`;

  return (
    <div style={{padding:16, maxWidth:800, margin:"0 auto", minHeight:"100vh"}}>
      <h1 style={{fontSize:22,fontWeight:800}}>Live Lessons</h1>
      <p style={{color:"#94a3b8", fontSize:13, marginBottom:16}}>Join live, ask questions, get recordings.</p>

      {liveNow.length>0 && (
        <div style={{background:"linear-gradient(135deg,#ff2d55,#7c3aed)", padding:16, borderRadius:16, marginBottom:16}}>
          <div style={{fontWeight:900, marginBottom:8}}>● LIVE NOW</div>
          {liveNow.map(l=>(
            <div key={l.id} style={{background:"rgba(0,0,0,0.25)", padding:12, borderRadius:12, marginBottom:8}}>
              <div style={{fontSize:12}}>{l.subject} • {fmt(l.start_time)}</div>
              <div style={{fontWeight:800, fontSize:16, margin:"4px 0 10px"}}>{l.topic}</div>
              <div style={{display:"flex", gap:8}}>
                <a href={l.meet_link} target="_blank" style={{flex:1, textAlign:"center", padding:12, borderRadius:10, background:"white", color:"black", fontWeight:900, textDecoration:"none"}}>Join Live Now</a>
                <a href={waLink(l.topic)} target="_blank" style={{padding:12, borderRadius:10, background:"rgba(0,0,0,0.4)", color:"white", textDecoration:"none"}}>💬</a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex", gap:8, marginBottom:16, background:"#15172a", padding:4, borderRadius:999, border:"1px solid #252a44"}}>
        <button onClick={()=>setTab("upcoming")} style={{flex:1, padding:10, borderRadius:999, border:0, fontWeight:800, background:tab==="upcoming"?"#232646":"transparent", color:tab==="upcoming"?"white":"#94a3b8"}}>Upcoming ({upcoming.length})</button>
        <button onClick={()=>setTab("recorded")} style={{flex:1, padding:10, borderRadius:999, border:0, fontWeight:800, background:tab==="recorded"?"#232646":"transparent", color:tab==="recorded"?"white":"#94a3b8"}}>Recordings ({recorded.length})</button>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:12}}>
        {(tab==="upcoming"?upcoming:recorded).map(l=>(
          <div key={l.id} style={{background:"#15172a", border:"1px solid #252a44", borderRadius:14, padding:14}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><span style={{fontSize:11, fontWeight:800, color:"#7c7cff"}}>{l.subject}</span><span style={{fontSize:11,color:"#6b7280"}}>{l.duration_minutes} min</span></div>
            <div style={{fontWeight:700, margin:"6px 0"}}>{l.topic}</div>
            <div style={{fontSize:12, color:"#94a3b8", marginBottom:12}}>📅 {fmt(l.start_time)}</div>
            {tab==="upcoming" ? (
              <div style={{display:"flex", gap:8}}>
                <a href={l.meet_link} target="_blank" style={{flex:1, textAlign:"center", padding:10, borderRadius:10, background:"#232646", color:"white", textDecoration:"none", border:"1px solid #7c7cff", fontWeight:700}}>Get Link</a>
                <a href={waLink(l.topic)} target="_blank" style={{flex:1, textAlign:"center", padding:10, borderRadius:10, background:"#25D366", color:"#0f111e", fontWeight:800, textDecoration:"none"}}>Notify Me</a>
              </div>
            ) : (
              <a href={l.recording_link} target="_blank" style={{display:"block", textAlign:"center", padding:10, borderRadius:10, background:"white", color:"black", fontWeight:800, textDecoration:"none"}}>▶ Watch Recording</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
