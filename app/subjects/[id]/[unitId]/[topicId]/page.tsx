"use client";
import { useState } from "react";
import Link from "next/link";

export default function TopicPage({ params }: any) {
  const [yt, setYt] = useState("");
  const getId = (url:string) => {
    try { const u=new URL(url); if(u.hostname.includes("youtu")) return u.searchParams.get("v") || u.pathname.split("/").pop(); } catch {}
    return null;
  };
  const vid = getId(yt);

  return (
    <div style={{background:"#0b0b12", minHeight:"100vh", color:"#fff", paddingBottom:80}}>
      <header style={{padding:14, borderBottom:"1px solid #1e1e2a", display:"flex", justifyContent:"space-between"}}>
        <Link href={`/subjects/${params.id}/${params.unitId}`}>‹ Back</Link>
        <span style={{fontSize:12, border:"1px solid #333", borderRadius:20, padding:"4px 10px"}}>{params.topicId}</span>
      </header>

      <div style={{padding:16}}>
        {/* Nodes A-E */}
        <div style={{display:"flex", gap:8, marginBottom:16}}>
          {["A: Notes","B: Diagram","C: Example","D: Mistakes","E: Exam Qs"].map((n,i)=>(
            <div key={i} style={{flex:1, background: i===0 ? "#7c3aed" : "#15151f", border:"1px solid #2a2a3a", borderRadius:12, padding:10, textAlign:"center", fontSize:11, fontWeight:700}}>{n}</div>
          ))}
        </div>

        <div style={{background:"#15151f", border:"1px solid #2a2a3a", borderRadius:16, padding:16}}>
          <h2 style={{fontWeight:800, fontSize:20, textTransform:"capitalize"}}>{params.topicId.replaceAll("-"," ")}</h2>
          <p style={{color:"#888", fontSize:13, marginTop:8}}>CAPS • Grade 12 • Unlisted YouTube supported</p>
          
          <div style={{marginTop:16}}>
            <label style={{fontSize:12, color:"#aaa"}}>Paste Unlisted YouTube link (teacher only)</label>
            <input value={yt} onChange={e=>setYt(e.target.value)} placeholder="https://youtu.be/..." style={{width:"100%", marginTop:6, background:"#0b0b12", border:"1px solid #2a2a3a", borderRadius:10, padding:12, color:"#fff"}}/>
          </div>

          {vid && <iframe style={{width:"100%", height:200, marginTop:12, borderRadius:12, border:0}} src={`https://www.youtube.com/embed/${vid}`} allowFullScreen/>}

          <div style={{marginTop:16, background:"#0b0b12", borderRadius:12, padding:12, border:"1px solid #1e1e2a"}}>
            <div style={{fontSize:12, fontWeight:700}}>Lesson Content</div>
            <div style={{color:"#666", fontSize:13, marginTop:6}}>Add your notes, diagrams, worked examples here. This page is ready for your CMS.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
