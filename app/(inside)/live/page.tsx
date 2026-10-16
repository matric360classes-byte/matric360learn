"use client";
import { useState } from "react";

const WA_NUMBER = "27729888561";

type Lesson = {
  id: string;
  subject: "Mathematics" | "Physical Sciences";
  topic: string;
  date: string; // e.g. 2026-10-18 19:00
  duration: string;
  status: "live" | "upcoming" | "recorded";
  meetLink: string; // Google Meet / Zoom / YouTube
  recordingLink?: string;
};

const LIVE_LESSONS: Lesson[] = [
  {
    id: "1",
    subject: "Mathematics",
    topic: "Calculus - Past Paper Tricks (Paper 1)",
    date: "Tonight 19:00 - 20:00",
    duration: "60 min",
    status: "live",
    meetLink: "https://meet.google.com/", // <- PUT YOUR REAL MEET LINK
    recordingLink: "",
  },
  {
    id: "2",
    subject: "Physical Sciences",
    topic: "Electrostatics + Past Questions",
    date: "Tomorrow 18:00 - 19:30",
    duration: "90 min",
    status: "upcoming",
    meetLink: "https://meet.google.com/",
  },
  {
    id: "3",
    subject: "Mathematics",
    topic: "Trigonometry Revision",
    date: "Sun 20 Oct - Recording",
    duration: "55 min",
    status: "recorded",
    meetLink: "",
    recordingLink: "https://youtube.com/", // <- YOUR YOUTUBE RECORDING
  },
];

export default function LiveLessonsPage() {
  const [tab, setTab] = useState<"upcoming" | "recorded">("upcoming");

  const liveNow = LIVE_LESSONS.filter(l => l.status === "live");
  const upcoming = LIVE_LESSONS.filter(l => l.status === "upcoming");
  const recorded = LIVE_LESSONS.filter(l => l.status === "recorded");

  const waNotifyLink = (topic: string) => 
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Tutor, please notify me for Live Lesson: ${topic}`)}`;

  return (
    <div style={{padding:16, maxWidth:800, margin:"0 auto", background:"#0f111e", minHeight:"100vh"}}>
      <h1 style={{fontSize:22, fontWeight:800, marginBottom:4}}>Live Lessons</h1>
      <p style={{color:"#94a3b8", fontSize:13, marginBottom:16}}>Join live, ask questions, get recordings.</p>

      {/* LIVE NOW */}
      {liveNow.length > 0 && (
        <div style={{background:"linear-gradient(135deg,#ff2d55 0%, #7c3aed 100%)", padding:16, borderRadius:16, marginBottom:16, border:"1px solid #ff2d55"}}>
          <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:8}}>
            <span style={{width:10,height:10, borderRadius:999, background:"white", display:"inline-block", animation:"pulse 1s infinite"}}></span>
            <span style={{fontWeight:900, letterSpacing:1}}>LIVE NOW</span>
          </div>
          {liveNow.map(l => (
            <div key={l.id} style={{background:"rgba(0,0,0,0.25)", padding:12, borderRadius:12}}>
              <div style={{fontSize:11, opacity:0.9, marginBottom:4}}>{l.subject} • {l.date}</div>
              <div style={{fontWeight:800, fontSize:16, marginBottom:10}}>{l.topic}</div>
              <div style={{display:"flex", gap:8}}>
                <a href={l.meetLink} target="_blank" style={{flex:1, textAlign:"center", padding:"12px", borderRadius:10, background:"white", color:"black", fontWeight:900, textDecoration:"none"}}>Join Live Now</a>
                <a href={waNotifyLink(l.topic)} target="_blank" style={{padding:"12px 14px", borderRadius:10, background:"rgba(0,0,0,0.4)", color:"white", textDecoration:"none"}}>💬</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TABS */}
      <div style={{display:"flex", gap:8, marginBottom:16, background:"#15172a", padding:4, borderRadius:999, border:"1px solid #252a44"}}>
        {[
          {k:"upcoming", label:`Upcoming (${upcoming.length})`},
          {k:"recorded", label:`Recordings (${recorded.length})`}
        ].map(t => (
          <button key={t.k} onClick={()=>setTab(t.k as any)} style={{
            flex:1, padding:"10px", borderRadius:999, border:0, fontWeight:800, fontSize:13,
            background: tab===t.k ? "#232646" : "transparent",
            color: tab===t.k ? "white" : "#94a3b8", cursor:"pointer"
          }}>{t.label}</button>
        ))}
      </div>

      {/* LIST */}
      <div style={{display:"flex", flexDirection:"column", gap:12}}>
        {(tab==="upcoming" ? upcoming : recorded).map(l => (
          <div key={l.id} style={{background:"#15172a", border:"1px solid #252a44", borderRadius:14, padding:14}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6}}>
              <span style={{fontSize:11, padding:"4px 8px", borderRadius:999, background: l.subject==="Mathematics" ? "#7c7cff22" : "#22c55e22", color: l.subject==="Mathematics" ? "#7c7cff" : "#22c55e", fontWeight:800}}>{l.subject}</span>
              <span style={{fontSize:11, color:"#6b7280"}}>{l.duration}</span>
            </div>
            <div style={{fontWeight:700, fontSize:15, marginBottom:4}}>{l.topic}</div>
            <div style={{fontSize:12, color:"#94a3b8", marginBottom:12}}>📅 {l.date}</div>
            
            {tab==="upcoming" ? (
              <div style={{display:"flex", gap:8}}>
                <a href={l.meetLink} target="_blank" style={{flex:1, textAlign:"center", padding:"10px", borderRadius:10, background:"#232646", color:"white", fontWeight:700, textDecoration:"none", border:"1px solid #7c7cff"}}>Get Link</a>
                <a href={waNotifyLink(l.topic)} target="_blank" style={{flex:1, textAlign:"center", padding:"10px", borderRadius:10, background:"#25D366", color:"#0f111e", fontWeight:800, textDecoration:"none"}}>Notify Me</a>
              </div>
            ) : (
              <div style={{display:"flex", gap:8}}>
                <a href={l.recordingLink} target="_blank" style={{flex:1, textAlign:"center", padding:"10px", borderRadius:10, background:"white", color:"black", fontWeight:800, textDecoration:"none"}}>▶ Watch Recording</a>
                <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi Tutor, I have a question about ${l.topic}`)}`} target="_blank" style={{padding:"10px 14px", borderRadius:10, background:"#15172a", border:"1px solid #252a44", color:"white", textDecoration:"none"}}>Ask</a>
              </div>
            )}
          </div>
        ))}

        {(tab==="upcoming" ? upcoming : recorded).length===0 && (
          <div style={{textAlign:"center", padding:40, color:"#6b7280", fontSize:14, background:"#15172a", borderRadius:14, border:"1px dashed #252a44"}}>
            No {tab} lessons yet. WhatsApp tutor for schedule.
          </div>
        )}
      </div>

      {/* BOTTOM CTA */}
      <div style={{marginTop:20, padding:16, borderRadius:14, background:"#1e2140", border:"1px solid #252a44", textAlign:"center"}}>
        <div style={{fontWeight:800, marginBottom:4}}>Want private live lessons?</div>
        <div style={{fontSize:12, color:"#94a3b8", marginBottom:12}}>Chat directly: 072 988 8561</div>
        <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Matric360 Tutor, I want to join Live Lessons")}`} target="_blank" style={{display:"inline-block", padding:"12px 20px", borderRadius:999, background:"#25D366", color:"#0f111e", fontWeight:900, textDecoration:"none"}}>💬 WhatsApp Tutor for Schedule</a>
      </div>
    </div>
  );
}
