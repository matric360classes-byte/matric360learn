"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page(){
  const [annual,setAnnual]=useState(false);
  const [open,setOpen]=useState<string|null>(null);
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState("All");

  const faqs=[
    {q:"What is Matric360?",a:"CAPS-aligned Grade 12 platform for Maths & Sciences.",c:"About"},
    {q:"Who is Matric360 for?",a:"Grade 12 learners who want Bachelor pass.",c:"About"},
    {q:"Which subjects are available?",a:"Mathematics (13 Units) & Physical Sciences (12 Units).",c:"Subjects & content"},
    {q:"Is Matric360 aligned with CAPS?",a:"Yes, 100% DBE CAPS aligned.",c:"Subjects & content"},
    {q:"Is there a free version?",a:"Yes - R0 forever: summaries + 1 quiz per unit.",c:"Pricing & access"},
    {q:"What does Premium include?",a:"Full videos, unlimited quizzes, past papers, AI tutor.",c:"Pricing & access"},
    {q:"How much does Matric360 cost?",a:"R149 for 1, R249 for 2, R300 for 3, R350 for 4, R400 for 5, R450 for 6+.",c:"Pricing & access"},
    {q:"Can I study on my phone?",a:"Yes, mobile-first and offline for summaries.",c:"Subjects & content"},
    {q:"Do I need an internet connection?",a:"No for summaries, yes for videos/quizzes.",c:"Subjects & content"},
    {q:"How does the Practice Engine work?",a:"Adaptive daily lessons based on weak topics.",c:"Practice & exams"},
    {q:"How do Past Papers work?",a:"Exam-style with memo + examiner traps.",c:"Practice & exams"},
    {q:"How is my progress tracked?",a:"XP, streak, readiness score per topic.",c:"Progress & parents"},
    {q:"Can parents monitor progress?",a:"Yes, parent visibility dashboard.",c:"Progress & parents"},
    {q:"Is my information secure?",a:"Yes, POPIA compliant.",c:"Privacy & security"},
    {q:"When is Matric360 launching?",a:"Now - early access open.",c:"About"},
  ];

  const cats=["All","About","Subjects & content","Pricing & access","Practice & exams","Progress & parents","Privacy & security"];
  const filtered=faqs.filter(f=>(cat==="All"||f.c===cat) && f.q.toLowerCase().includes(search.toLowerCase()));

  const plans=[
    {n:"1 Subject",p:149,free:false},{n:"2 Subjects",p:249,pop:true},{n:"3 Subjects",p:300},{n:"4 Subjects",p:350},{n:"5 Subjects",p:400},{n:"6+ Subjects",p:450,best:true},
  ];

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white"}}>
      {/* HEADER */}
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#0f1020",position:"sticky",top:0,zIndex:50}}><div style={{display:"flex",gap:8,alignItems:"center"}}><img src="/logo.png" alt="logo" style={{width:32,height:32,borderRadius:8}}/><div style={{fontWeight:800}}>Matric<span style={{color:"#38bdf8"}}>3</span><span style={{color:"#fbbf24"}}>60</span></div></div><div style={{display:"flex",gap:12}}><Link href="/login" style={{color:"#94a3b8",textDecoration:"none",fontSize:14,alignSelf:"center"}}>Login</Link><Link href="/signup" style={{background:"#fbbf24",color:"black",padding:"10px 18px",borderRadius:999,fontWeight:800,textDecoration:"none",fontSize:14}}>Start Free</Link></div></header>

      {/* HERO + DASHBOARD */}
      <section style={{padding:"20px",textAlign:"center"}}><div style={{display:"inline-flex",background:"#1a1c32",border:"1px solid #2a2c4a",padding:"6px 14px",borderRadius:999,fontSize:12}}>🟢 CAPS-Aligned · Grade 12</div><h1 style={{fontSize:34,fontWeight:900,lineHeight:1.15,marginTop:16}}>Master Grade 12 Maths<br/>& Physical Sciences<br/>with <span style={{background:"linear-gradient(90deg,#22d3ee,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Confidence</span></h1><p style={{color:"#94a3b8",fontSize:13,marginTop:10}}>Start with CAPS-aligned Grade 12 lessons and build progress step by step.</p><div style={{display:"flex",flexDirection:"column",gap:10,marginTop:18}}><Link href="/signup" style={{background:"#fbbf24",color:"black",padding:"16px",borderRadius:16,fontWeight:800,textDecoration:"none"}}>✨ Start Studying Free</Link><Link href="#how" style={{background:"#1e2035",color:"white",padding:"14px",borderRadius:16,border:"1px solid #2d304f",textDecoration:"none"}}>▷ See How It Works</Link></div></section>

      <section style={{padding:"16px"}}><div style={{background:"#1a1c32",borderRadius:28,padding:12,border:"1px solid #2a2d4a"}}><div style={{background:"#0f111f",borderRadius:20,padding:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#94a3b8"}}><span>Dashboard</span><span style={{color:"#fbbf24"}}>🔥 5 day streak</span></div><div style={{background:"#171a2e",borderRadius:16,padding:14,marginTop:10}}><div style={{fontSize:11,color:"#94a3b8"}}>Exam Readiness</div><div style={{fontSize:26,fontWeight:900,color:"#10b981"}}>75%</div></div></div></div></section>

      {/* HOW IT WORKS */}
      <section id="how" style={{padding:"24px 16px"}}><h2 style={{fontWeight:900,fontSize:22,textAlign:"center"}}>See how Matric360 works</h2><div style={{display:"flex",flexDirection:"column",gap:12,marginTop:16}}><div style={{background:"#15172a",borderRadius:18,padding:16,border:"1px solid #2a2d4a"}}><b>1. Diagnose</b><p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>Quick diagnostic to reveal weak areas.</p></div><div style={{background:"#15172a",borderRadius:18,padding:16,border:"1px solid #2a2d4a"}}><b>2. Practice</b><p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>Adaptive lessons, past papers and mocks.</p></div><div style={{background:"#15172a",borderRadius:18,padding:16,border:"1px solid #2a2d4a"}}><b>3. Track progress</b><p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>XP, streaks and mastery with parent view.</p></div></div></section>

      {/* STRUGGLE */}
      <section style={{padding:"16px"}}><div style={{color:"#22d3ee",fontSize:11,textAlign:"center",letterSpacing:2,fontWeight:800}}>THE MATRIC STRUGGLE</div><h2 style={{fontWeight:900,fontSize:22,textAlign:"center",marginTop:6}}>Sound familiar?</h2><div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14}}>{['"I study hard but I still don\'t know what will be tested."','"Past papers feel confusing without guidance."','"I fall behind and don\'t know where to restart."'].map(t=><div key={t} style={{background:"#15172a",borderRadius:18,padding:16,border:"1px solid #2a2d4a",fontSize:14}}>{t}</div>)}</div></section>

      {/* METHOD */}
      <section style={{padding:"24px 16px"}}><div style={{color:"#22d3ee",fontSize:11,textAlign:"center",letterSpacing:2,fontWeight:800}}>THE MATRIC360 METHOD</div><h2 style={{fontSize:20,fontWeight:900,textAlign:"center",marginTop:6}}>Every topic, taught in a full circle.</h2><div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14}}>{[["A","Exam Hook"],["B","Learn the Concept"],["C","Examiner Traps"],["D","Exam Strategy"],["E","Exam Challenge"]].map(([l,t])=><div key={l} style={{background:"#15172a",borderRadius:16,padding:14,border:"1px solid #2a2d4a",borderLeft:"3px solid #a855f7"}}><b>{l}. {t}</b></div>)}</div></section>

      {/* SUBJECTS */}
      <section style={{padding:"24px 16px"}}><div style={{color:"#22d3ee",fontSize:11,textAlign:"center",letterSpacing:2,fontWeight:800}}>WHAT'S COVERED</div><h2 style={{fontWeight:900,fontSize:22,textAlign:"center",marginTop:6}}>The subjects that decide your APS.</h2><div style={{display:"flex",flexDirection:"column",gap:12,marginTop:14}}><div style={{background:"#15172a",borderRadius:20,padding:18,border:"1px solid #2a2d4a"}}><div style={{width:40,height:40,background:"linear-gradient(135deg,#6366f1,#a855f7)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}>∑</div><div style={{fontWeight:800,marginTop:10}}>Mathematics</div><p style={{color:"#94a3b8",fontSize:12}}>Algebra, Functions, Calculus, Trig etc.</p></div><div style={{background:"#15172a",borderRadius:20,padding:18,border:"1px solid #2a2d4a"}}><div style={{width:40,height:40,background:"linear-gradient(135deg,#0ea5e9,#38bdf8)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center"}}>⚛</div><div style={{fontWeight:800,marginTop:10}}>Physical Sciences</div><p style={{color:"#94a3b8",fontSize:12}}>Physics & Chemistry: mechanics, organic, etc.</p></div></div></section>

      {/* TOOLS */}
      <section style={{padding:"24px 16px"}}><div style={{color:"#22d3ee",fontSize:11,textAlign:"center",letterSpacing:2,fontWeight:800}}>INSIDE MATRIC360</div><h2 style={{fontWeight:900,textAlign:"center",marginTop:6}}>Tools built for matric success.</h2><div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14}}>{[["Adaptive recommendations","A study path that adjusts based on what you actually need next."],["Revision planner","A clear weekly plan from today through your final exam."],["Exam readiness","Track your readiness score per subject as it grows over time."],["Progress tracking","See mastery topic-by-topic, never vague 'progress'."],["CAPS-aligned lessons","Structured, exam-focused lessons mapped to the Grade 12 curriculum."],["Weak-topic insights","Spot weak topics early, while there's still time to act."],["Exam readiness score","An honest, weekly readiness picture per subject."]].map(([t,d])=><div key={t} style={{background:"#15172a",borderRadius:18,padding:16,border:"1px solid #2a2d4a"}}><div style={{fontWeight:700}}>{t}</div><div style={{color:"#94a3b8",fontSize:12,marginTop:4}}>{d}</div></div>)}</div></section>

      {/* PRICING */}
      <section id="pricing" style={{padding:"24px 16px"}}><div style={{color:"#22d3ee",fontSize:11,textAlign:"center",letterSpacing:2,fontWeight:800}}>SIMPLE PRICING</div><h2 style={{fontWeight:900,fontSize:22,textAlign:"center",marginTop:6}}>Start free. Upgrade when you're ready.</h2><div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginTop:16}}><span style={{fontSize:12,color:!annual?"white":"#64748b"}}>Monthly</span><button onClick={()=>setAnnual(!annual)} style={{width:44,height:22,borderRadius:999,border:"none",background:annual?"#fbbf24":"#2a2d4a",position:"relative"}}><div style={{width:16,height:16,background:"white",borderRadius:999,position:"absolute",top:3,left:annual?24:3}}></div></button><span style={{fontSize:12,color:annual?"white":"#64748b"}}>Annual</span><span style={{background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"3px 6px",borderRadius:999}}>2 MONTHS FREE</span></div><div style={{display:"flex",flexDirection:"column",gap:10,marginTop:16}}><div style={{background:"#15172a",borderRadius:16,padding:16,border:"1px solid #2a2d4a"}}><div style={{fontSize:11,color:"#94a3b8"}}>FREE</div><div style={{fontSize:28,fontWeight:900}}>R0<span style={{fontSize:14,fontWeight:400,color:"#94a3b8"}}> /forever</span></div><div style={{fontSize:12,color:"#94a3b8",marginTop:6}}>✓ CAPS lessons ✓ 1 quiz per unit</div></div>{plans.map(p=><div key={p.n} style={{background:p.pop?"linear-gradient(180deg,#1e2035,#15172a)":"#15172a",border:p.pop?"1px solid #fbbf24":"1px solid #2a2d4a",borderRadius:16,padding:16,position:"relative"}}>{p.pop&&<div style={{position:"absolute",top:-8,right:10,background:"#fbbf24",color:"black",fontSize:9,fontWeight:800,padding:"2px 8px",borderRadius:999}}>POPULAR</div>}<div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontWeight:700}}>{p.n}</div><div style={{fontWeight:900}}>R{annual?Math.round(p.p*10/12):p.p}<span style={{fontSize:10,color:"#94a3b8"}}>{annual?" /mo":""}</span></div></div>{p.best&&<div style={{fontSize:10,color:"#a855f7",marginTop:4}}>Best value</div>}</div>)}</div><div style={{textAlign:"center",fontSize:11,color:"#94a3b8",marginTop:10}}>Annual = Pay 10 months, get 12. Saves 2 months.</div></section>

      {/* FAQ */}
      <section style={{padding:"24px 16px"}}><div style={{color:"#22d3ee",fontSize:11,textAlign:"center",letterSpacing:2,fontWeight:800}}>FREQUENTLY ASKED QUESTIONS</div><h2 style={{fontWeight:900,fontSize:22,textAlign:"center",marginTop:6}}>Everything you need to know.</h2><div style={{marginTop:14,position:"relative"}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions..." style={{width:"100%",background:"#15172a",border:"1px solid #2a2d4a",borderRadius:999,padding:"12px 16px",color:"white"}}/></div><div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>{cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"6px 12px",borderRadius:999,border:"1px solid #2a2d4a",background:cat===c?"#1e293b":"#15172a",color:cat===c?"white":"#94a3b8",fontSize:12}}>{c}</button>)}</div><div style={{display:"flex",flexDirection:"column",gap:8,marginTop:14}}>{filtered.map(f=><div key={f.q} style={{background:"#15172a",border:"1px solid #2a2d4a",borderRadius:16,padding:"14px 16px"}}><button onClick={()=>setOpen(open===f.q?null:f.q)} style={{width:"100%",display:"flex",justifyContent:"space-between",background:"none",border:"none",color:"white",fontWeight:600,textAlign:"left"}}>{f.q}<span style={{color:"#22d3ee"}}>{open===f.q?"−":"+"}</span></button>{open===f.q&&<p style={{color:"#94a3b8",fontSize:12,marginTop:8}}>{f.a}</p>}</div>)}</div></section>

      {/* FACEBOOK + CTA */}
      <section style={{padding:"16px"}}>
        <div style={{background:"#15172a",border:"1px solid #2a2d4a",borderRadius:24,padding:24,textAlign:"center"}}>
          <div style={{width:48,height:48,background:"#1e293b",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",color:"#22d3ee"}}>f</div>
          <div style={{fontWeight:800,fontSize:18,marginTop:12}}>Follow Matric360 on Facebook</div>
          <div style={{color:"#94a3b8",fontSize:12,marginTop:6}}>Study tips, exam reminders and Grade 12 CAPS updates straight to your feed.</div>
          <a href="https://facebook.com" target="_blank" style={{display:"inline-block",marginTop:12,background:"#1877f2",color:"white",padding:"10px 20px",borderRadius:999,textDecoration:"none",fontWeight:700,fontSize:14}}>f Follow on Facebook</a>
        </div>
        <div style={{background:"#1a1d3a",border:"1px solid #2a2d4a",borderRadius:24,padding:28,textAlign:"center",marginTop:16}}>
          <div style={{fontSize:28}}>🎓</div>
          <h2 style={{fontWeight:900,fontSize:24,marginTop:10}}>Start your Matric360 journey today.</h2>
          <p style={{color:"#94a3b8",fontSize:13,marginTop:8}}>Create a free account and start with CAPS-aligned Grade 12 lessons today.</p>
          <Link href="/signup" style={{display:"inline-block",marginTop:16,background:"#fbbf24",color:"black",padding:"14px 24px",borderRadius:999,fontWeight:800,textDecoration:"none"}}>✨ Start Studying Free →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{padding:"24px 16px",textAlign:"center",borderTop:"1px solid #1e2035",marginTop:10}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}><img src="/logo.png" alt="logo" style={{width:32,height:32,borderRadius:8}}/><div><div style={{fontWeight:800}}>Matric<span style={{color:"#38bdf8"}}>3</span><span style={{color:"#fbbf24"}}>60</span></div><div style={{fontSize:12,color:"#94a3b8"}}>Matric in your Hands</div></div></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginTop:16,fontSize:12,color:"#94a3b8"}}><Link href="/subjects" style={{color:"#94a3b8",textDecoration:"none"}}>Subjects</Link><Link href="#pricing" style={{color:"#94a3b8",textDecoration:"none"}}>Pricing</Link><span>About</span><span>Contact</span><span>Privacy</span><span>Terms</span><span>Cookies</span><span>f</span></div>
        <div style={{color:"#475569",fontSize:11,marginTop:16}}>© 2026 Matric360. Built for South African Grade 12 learners.</div>
      </footer>
    </div>
  )
}
