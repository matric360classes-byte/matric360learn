"use client";
import { useState } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";

export default function Page(){
  const [q,setQ]=useState<string|null>(null);
  const [menuOpen, setMenuOpen]=useState(false);

  const faqs=[
    {q:"What is Matric360?",a:"CAPS-aligned Grade 12 platform - Maths 13 Units, Sciences, Languages."},
    {q:"Who is Matric360 for?",a:"Grade 12 learners who want to pass with Bachelor."},
    {q:"Which subjects are available?",a:"Maths (13 Units), Physical Sciences - 2 subjects to start."},
    {q:"Is Matric360 aligned with CAPS?",a:"Yes - every lesson is CAPS aligned."},
    {q:"Is there a free version?",a:"Yes - R0 forever: CAPS summaries + 1 quiz per unit."},
    {q:"What does Premium include?",a:"Full CAPS, videos, unlimited quizzes, past papers."},
    {q:"How much does Matric360 cost?",a:"R149 for 1, R249 for all subjects."},
    {q:"Can I study on my phone?",a:"Yes - mobile-first, works offline for summaries."},
  ];

  return(
    <div style={{background:"#0a0d1f",minHeight:"100vh",color:"white", fontFamily:"Inter, sans-serif"}}>
      
      {/* HEADER - YOUR LOGO + HAMBURGER */}
      <header style={{display:"flex",justifyContent:"space-between",padding:"14px 16px",alignItems:"center", background:"#0a0d1f", position:"sticky", top:0, zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setMenuOpen(true)} style={{fontSize:22, background:"none", border:"none", color:"white", cursor:"pointer"}}>☰</button>
          <img src="/logo.png" alt="Matric360" style={{width:32,height:32,borderRadius:8}}/>
          <div style={{fontWeight:800,fontSize:18}}>Matric360</div>
        </div>
        <Link href="/maths" style={{background:"#ffde59",color:"black",padding:"8px 14px",borderRadius:20,fontWeight:700,textDecoration:"none", fontSize:14}}>Start Learning</Link>
      </header>

      {/* HERO - YOUR ORIGINAL */}
      <section style={{padding:"32px 20px"}}>
        <h1 style={{fontSize:34,fontWeight:900,lineHeight:1.1}}>Pass Matric<br/><span style={{color:"#ffde59"}}>With Confidence</span></h1>
        <p style={{color:"#9aa0b8",marginTop:10, fontSize:15}}>CAPS-aligned • Mobile-first • 2 Subjects to start</p>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <Link href="/maths" style={{background:"#ffde59",color:"black",padding:"12px 18px",borderRadius:12,fontWeight:800,textDecoration:"none"}}>View Subjects →</Link>
          <Link href="/dashboard" style={{border:"1px solid #2a2f45",color:"white",padding:"12px 18px",borderRadius:12,textDecoration:"none"}}>My Dashboard</Link>
        </div>
      </section>

      {/* 2 SUBJECTS ONLY - CLICKABLE */}
      <section style={{padding:"0 16px 20px"}}>
        <h2 style={{fontSize:14, letterSpacing:2, color:"#6b7280", fontWeight:700, marginBottom:12}}>2 SUBJECTS - TAP TO START</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Link href="/maths" style={{textDecoration:"none", background:"#fffbe6", padding:16, borderRadius:16, border:"1px solid #f5e9a8"}}>
            <div style={{fontSize:22}}>∑</div>
            <div style={{fontWeight:800,color:"black",marginTop:6}}>Mathematics</div>
            <div style={{fontSize:12,color:"#666"}}>13 Units • CAPS</div>
          </Link>
          <Link href="/physics" style={{textDecoration:"none", background:"#eef2ff", padding:16, borderRadius:16, border:"1px solid #d0d8ff"}}>
            <div style={{fontSize:22}}>🧪</div>
            <div style={{fontWeight:800,color:"black",marginTop:6}}>Physical Sciences</div>
            <div style={{fontSize:12,color:"#666"}}>12 Units • CAPS</div>
          </Link>
        </div>
      </section>

      {/* FAQ - YOUR ORIGINAL WORKING */}
      <section style={{padding:"20px",background:"white",color:"black", borderRadius:"24px 24px 0 0", marginTop:12}}>
        <h2 style={{fontWeight:800,fontSize:20, marginBottom:12}}>FAQ</h2>
        {faqs.map(f=>(
          <div key={f.q} style={{borderBottom:"1px solid #eee",padding:"14px 0"}}>
            <button onClick={()=>setQ(q===f.q?null:f.q)} style={{width:"100%",textAlign:"left",fontWeight:600,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer", fontSize:15}}>{f.q}<span>{q===f.q?"−":"+"}</span></button>
            {q===f.q&&<p style={{color:"#555",fontSize:14,marginTop:8, lineHeight:1.5}}>{f.a}</p>}
          </div>
        ))}
      </section>

      <footer style={{padding:20,textAlign:"center",color:"#666",fontSize:12, background:"white"}}>© 2026 Matric360Learn - matric360learn.co.za</footer>

      {/* SIDEBAR - FROM YOUR SCREENSHOT */}
      <Sidebar open={menuOpen} onClose={()=>setMenuOpen(false)} />
    </div>
  )
}
