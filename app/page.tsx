"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page(){
  const [q,setQ]=useState<string|null>(null);
  const faqs=[
    {q:"What is MATRIC360?",a:"CAPS-aligned Grade 12 platform - 13 Units Maths, Sciences, more."},
    {q:"Who is it for?",a:"Grade 12 learners who want to pass with Bachelor."},
    {q:"Which subjects?",a:"Maths, Physical Sciences + more — 2 to start, 6+ available."},
    {q:"CAPS aligned?",a:"Yes - 100% DBE CAPS aligned."},
    {q:"Free version?",a:"Yes - R0 forever."},
    {q:"What does Premium include?",a:"Videos, unlimited quizzes, past papers, AI tutor."},
    {q:"How much?",a:"R149 for 1 subject up to R450 for 6+ subjects."},
    {q:"Phone?",a:"Yes - mobile-first."},
  ];
  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",background:"#0f1020",position:"sticky",top:0,zIndex:50,borderBottom:"1px solid #1e2035"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><img src="/logo.png" alt="MATRIC360" style={{width:36,height:36,borderRadius:8}}/><div style={{fontWeight:800,fontSize:19}}>Matric<span style={{color:"#38bdf8"}}>3</span><span style={{color:"#fbbf24"}}>60</span></div></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}><Link href="/login" style={{color:"#cbd5e1",textDecoration:"none",fontSize:14}}>Login</Link><Link href="/signup" style={{background:"#fbbf24",color:"black",padding:"10px 18px",borderRadius:999,fontWeight:800,textDecoration:"none",fontSize:14}}>Start Free</Link></div>
      </header>

      <section style={{padding:"28px 20px 10px",textAlign:"center"}}>
        <div style={{display:"inline-flex",gap:8,background:"#1a1c32",border:"1px solid #2a2c4a",padding:"6px 14px",borderRadius:999,fontSize:12}}>🟢 CAPS-Aligned · Grade 12</div>
        <h1 style={{fontSize:36,fontWeight:900,lineHeight:1.15,marginTop:20}}>Master Grade 12 Maths<br/>& Physical Sciences<br/>with <span style={{background:"linear-gradient(90deg,#38bdf8,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Confidence</span></h1>
        <p style={{color:"#94a3b8",marginTop:12,fontSize:14}}>Start with CAPS-aligned lessons and build progress step by step.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:22}}>
          <Link href="/signup" style={{background:"#fbbf24",color:"black",padding:"16px",borderRadius:16,fontWeight:800,textDecoration:"none"}}>✨ Start Studying Free</Link>
          <Link href="#pricing" style={{background:"#1e2035",color:"white",padding:"14px",borderRadius:16,border:"1px solid #2d304f",textDecoration:"none"}}>▶ See Pricing</Link>
        </div>
      </section>

      <section style={{padding:"18px"}}><div style={{background:"#1a1c32",borderRadius:24,padding:12,border:"1px solid #2a2d4a"}}><div style={{background:"#0f111f",borderRadius:18,padding:14}}><div style={{display:"flex",justifyContent:"space-between",color:"#94a3b8",fontSize:12}}><span>Dashboard</span><span style={{color:"#fbbf24"}}>🔥 5 day streak</span></div><div style={{background:"#1a1c32",borderRadius:16,padding:14,marginTop:12}}><div style={{color:"#94a3b8",fontSize:11}}>Exam Readiness</div><div style={{fontSize:26,fontWeight:900,color:"#10b981",marginTop:4}}>75%</div><div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:10}}><div style={{width:"75%",height:"100%",background:"linear-gradient(90deg,#3b82f6,#a855f7)",borderRadius:999}}></div></div></div></div></div></section>

      {/* PRICING - YOUR EXACT NUMBERS */}
      <section id="pricing" style={{padding:"32px 16px"}}>
        <h2 style={{fontWeight:900,fontSize:22,textAlign:"center"}}>Simple Pricing</h2>
        <p style={{textAlign:"center",color:"#94a3b8",fontSize:13,marginTop:6}}>Pay per subject - Annual = 2 months free</p>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:18}}>
          <div style={{background:"#15172a",border:"1px solid #2a2c4a",borderRadius:16,padding:16}}><div style={{fontWeight:700}}>1 Subject</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R149</div><div style={{fontSize:12,color:"#94a3b8"}}>once-off</div></div>
          <div style={{background:"linear-gradient(180deg,#1e2035,#15172a)",border:"1px solid #fbbf24",borderRadius:16,padding:16,position:"relative"}}><div style={{position:"absolute",top:-10,right:12,background:"#fbbf24",color:"black",fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:999}}>POPULAR</div><div style={{fontWeight:700}}>2 Subjects</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R249</div><div style={{fontSize:12,color:"#94a3b8"}}>once-off • Save R49</div></div>
          <div style={{background:"#15172a",border:"1px solid #2a2c4a",borderRadius:16,padding:16}}><div style={{fontWeight:700}}>3 Subjects</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R300</div><div style={{fontSize:12,color:"#94a3b8"}}>once-off</div></div>
          <div style={{background:"#15172a",border:"1px solid #2a2c4a",borderRadius:16,padding:16}}><div style={{fontWeight:700}}>4 Subjects</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R350</div><div style={{fontSize:12,color:"#94a3b8"}}>once-off</div></div>
          <div style={{background:"#15172a",border:"1px solid #2a2c4a",borderRadius:16,padding:16}}><div style={{fontWeight:700}}>5 Subjects</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R400</div><div style={{fontSize:12,color:"#94a3b8"}}>once-off</div></div>
          <div style={{background:"#15172a",border:"1px solid #a855f7",borderRadius:16,padding:16}}><div style={{fontWeight:700}}>6+ Subjects — All Access</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R450</div><div style={{fontSize:12,color:"#a855f7",fontWeight:700}}>Best value • All current + future subjects</div></div>
          <div style={{background:"#0f1020",border:"1px dashed #fbbf24",borderRadius:16,padding:14,textAlign:"center"}}><div style={{fontWeight:800,color:"#fbbf24",fontSize:13}}>ANNUAL PLAN • 2 Months Free</div><div style={{color:"#94a3b8",fontSize:12,marginTop:4}}>Pay 10 months, get 12 — on any bundle above</div></div>
          <div style={{background:"#15172a",border:"1px solid #2a2c4a",borderRadius:16,padding:16}}><div style={{fontWeight:700}}>Free Forever</div><div style={{fontSize:28,fontWeight:900,marginTop:4}}>R0</div><div style={{fontSize:12,color:"#94a3b8"}}>CAPS summaries + 1 quiz per unit</div></div>
        </div>
      </section>

      <section style={{padding:"24px 16px",background:"#0f1020",borderTop:"1px solid #1e2035"}}><h2 style={{fontWeight:800,fontSize:20}}>FAQ</h2>{faqs.map(f=>(<div key={f.q} style={{borderBottom:"1px solid #1e2035",padding:"14px 0"}}><button onClick={()=>setQ(q===f.q?null:f.q)} style={{width:"100%",textAlign:"left",fontWeight:600,display:"flex",justifyContent:"space-between",background:"none",border:"none",color:"white",cursor:"pointer"}}>{f.q}<span style={{color:"#fbbf24"}}>{q===f.q?"−":"+"}</span></button>{q===f.q&&<p style={{color:"#94a3b8",fontSize:13,marginTop:8}}>{f.a}</p>}</div>))}</section>

      <footer style={{padding:20,textAlign:"center",color:"#64748b",fontSize:11}}>© 2026 MATRIC360 — Video engine supports 80min+</footer>
    </div>
  )
}
