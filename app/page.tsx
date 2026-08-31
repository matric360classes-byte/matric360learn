"use client";
import Link from "next/link";
import { useState } from "react";

export default function Page(){
  const [q,setQ]=useState<string|null>(null);
  const faqs=[
    {q:"What is Matric360?",a:"CAPS-aligned Grade 12 platform for Maths & Science with 135 lessons, 45min videos (supports 80min+), practice and exam readiness."},
    {q:"Who is Matric360 for?",a:"Grade 12 learners who want APS and final exam mastery."},
    {q:"Which subjects are available?",a:"Maths (13 Units) and Physical Sciences (8 Physics + 6 Chemistry). More subjects coming — pricing ready for 6+."},
    {q:"Is Matric360 aligned with CAPS?",a:"Yes — every lesson follows DBE CAPS, built for final exam marks."},
    {q:"Is there a free version?",a:"Yes — R0 forever: CAPS lessons, limited access, basic tracking."},
    {q:"What does Premium include?",a:"Full CAPS, videos, unlimited practice, past papers, adaptive path, readiness score, parent dashboard."},
    {q:"How much does Matric360 cost?",a:"R149 for 1, R249 for 2, R300 for 3, R350 for 4, R400 for 5, R450 for 6+. Annual = 2 months free."},
    {q:"Can I study on my phone?",a:"Yes — mobile-first, WhatsApp generation, phone/tablet/laptop."},
    {q:"Do I need internet?",a:"Yes for videos and tracking — lessons are data-light, 45min avg."},
    {q:"How does Practice Engine work?",a:"A-E Nodes: Hook, Learn, Traps, Strategy, Challenge — loops until mastered."},
    {q:"How do Past Papers work?",a:"DBE style with marking guidelines per subtopic."},
    {q:"How is progress tracked?",a:"XP, streak, level, exam readiness, weak topics detection."},
    {q:"Can parents monitor?",a:"Yes — weekly visibility, weak-topic insights, readiness score."},
    {q:"Is my information secure?",a:"Yes — local progress, secure auth, POPIA compliant."},
    {q:"When is Matric360 launching?",a:"Live now — matric360learn.vercel.app branded as MATRIC360."},
  ];

  return(
    <div style={{background:"#0a0d1f",minHeight:"100vh",color:"#fff",fontFamily:"Inter,system-ui"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderBottom:"1px solid #1a1e35",position:"sticky",top:0,background:"#0a0d1f",zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#00d4ff,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>360</div><span style={{fontWeight:900}}>Matric<span style={{color:"#00d4ff"}}>3</span><span style={{color:"#fbbf24"}}>60</span></span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}><img src="/logo.png" alt="Matric360" style={{width:36,height:36,borderRadius:10,objectFit:"contain",background:"#fff",padding:2}} /><div style={{fontWeight:900,letterSpacing:"-0.5px"}}>Matric360</div></div>
      </header>

      <section style={{padding:"28px 20px 0",textAlign:"center",maxWidth:520,margin:"0 auto"}}>
        <div style={{display:"inline-flex",gap:8,background:"#151932",border:"1px solid #242845",borderRadius:999,padding:"6px 14px",fontSize:12,color:"#a0a7c2"}}><span style={{width:8,height:8,borderRadius:99,background:"#10b981",display:"inline-block"}}/> CAPS-Aligned · Grade 12</div>
        <h1 style={{fontSize:36,lineHeight:1.1,fontWeight:900,marginTop:22}}>Master Grade 12 Maths<br/>& Physical Sciences<br/>with <span style={{background:"linear-gradient(90deg,#22d3ee,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Confidence</span></h1>
        <p style={{color:"#8b90a8",fontSize:15,marginTop:14}}>Start with CAPS-aligned Grade 12 lessons and build progress step by step.</p>
        <div style={{marginTop:22,display:"flex",flexDirection:"column",gap:10}}><Link href="/subjects" style={{background:"#fbbf24",color:"#000",padding:"16px",borderRadius:16,fontWeight:900,textDecoration:"none"}}>✨ Start Studying Free</Link><a href="#how" style={{background:"#1a1e35",border:"1px solid #2a3054",color:"#fff",padding:"16px",borderRadius:16,fontWeight:700,textDecoration:"none"}}>▷ See How It Works</a></div>
        <div style={{marginTop:24,background:"linear-gradient(180deg,#1a1e3a,#13162b)",borderRadius:32,padding:12,border:"1px solid #252a4a"}}><div style={{background:"#0f1224",borderRadius:24,padding:16,border:"1px solid #1e2340"}}><div style={{display:"flex",justifyContent:"space-between",color:"#8b90a8",fontSize:12}}><span>Dashboard</span><span style={{color:"#fbbf24"}}>🔥 5 day streak</span></div><div style={{marginTop:12,background:"#1a1e3a",borderRadius:20,padding:14,textAlign:"left",border:"1px solid #252a4a"}}><div style={{color:"#8b90a8",fontSize:12}}>Exam Readiness</div><div style={{display:"flex",gap:8,alignItems:"baseline",marginTop:4}}><span style={{fontSize:32,fontWeight:900,color:"#10b981"}}>75%</span><span style={{color:"#10b981",fontSize:12}}>On track</span></div><div style={{marginTop:10,height:8,background:"#252a4a",borderRadius:99}}><div style={{width:"75%",height:"100%",background:"linear-gradient(90deg,#3b82f6,#a855f7)",borderRadius:99}}/></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}><div style={{background:"#1a1e3a",borderRadius:16,padding:12,textAlign:"left",border:"1px solid #252a4a"}}><div style={{color:"#8b90a8",fontSize:10}}>LEVEL</div><div style={{fontWeight:900,marginTop:4}}>12</div><div style={{color:"#22d3ee",fontSize:11}}>+240 XP today</div></div><div style={{background:"#1a1e3a",borderRadius:16,padding:12,textAlign:"left",border:"1px solid #252a4a"}}><div style={{color:"#8b90a8",fontSize:10}}>GOAL</div><div style={{fontWeight:900,marginTop:4}}>100 XP</div><div style={{color:"#10b981",fontSize:11}}>Almost there</div></div></div></div></div>
      </section>

      <section id="how" style={{padding:"50px 20px",maxWidth:520,margin:"0 auto",textAlign:"center"}}><h2 style={{fontSize:24,fontWeight:900}}>See how Matric360 works</h2><p style={{color:"#8b90a8",fontSize:13,marginTop:8}}>Quick tour of daily practice, past papers, mock exams and progress tracking — everything Grade 12 learners need.</p>
        <div style={{marginTop:18,textAlign:"left",display:"grid",gap:10}}>{[{n:"1. Diagnose",d:"Quick diagnostic to reveal weak areas."},{n:"2. Practice",d:"Adaptive daily lessons, past papers and mocks."},{n:"3. Track progress",d:"XP, streaks and mastery — with parent visibility."}].map(i=><div key={i.n} style={{background:"#151932",border:"1px solid #252a4a",borderRadius:18,padding:16}}><div style={{fontWeight:800}}>{i.n}</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>{i.d}</div></div>)}</div>
      </section>

      <section style={{padding:"20px",maxWidth:520,margin:"0 auto",textAlign:"center"}}><div style={{color:"#22d3ee",fontSize:11,letterSpacing:2,fontWeight:800}}>THE MATRIC STRUGGLE</div><h2 style={{fontSize:24,fontWeight:900,marginTop:8}}>Sound familiar?</h2><div style={{marginTop:16,display:"grid",gap:10,textAlign:"left"}}>{["I study hard but still don't know what will be tested.","Past papers feel confusing without guidance.","I fall behind and don't know where to restart."].map(q=><div key={q} style={{background:"#151932",border:"1px solid #252a4a",borderRadius:18,padding:16}}><div style={{fontSize:14}}>"{q}"</div></div>)}</div></section>

      <section style={{padding:"30px 20px",maxWidth:520,margin:"0 auto",textAlign:"center"}}><div style={{color:"#22d3ee",fontSize:11,letterSpacing:2,fontWeight:800}}>THE MATRIC360 METHOD</div><h2 style={{fontSize:24,fontWeight:900,marginTop:8}}>Every topic, taught in a full circle.</h2><div style={{marginTop:18,textAlign:"left",display:"grid",gap:10}}>{[{k:"A",t:"Exam Hook"},{k:"B",t:"Learn the Concept"},{k:"C",t:"Examiner Traps"},{k:"D",t:"Exam Strategy"},{k:"E",t:"Exam Challenge"}].map(m=><div key={m.k} style={{background:"#151932",border:"1px solid #252a4a",borderRadius:18,padding:14,display:"flex",gap:10}}><div style={{width:28,height:28,borderRadius:99,background:"#1e2340",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#22d3ee"}}>{m.k}</div><div style={{fontWeight:700,fontSize:14}}>{m.t}</div></div>)}</div></section>

      <section style={{padding:"30px 20px",maxWidth:520,margin:"0 auto",textAlign:"center"}}><div style={{color:"#22d3ee",fontSize:11,letterSpacing:2,fontWeight:800}}>WHAT'S COVERED</div><h2 style={{fontSize:24,fontWeight:900,marginTop:8}}>The subjects that decide your APS.</h2><div style={{marginTop:18,display:"grid",gap:12,textAlign:"left"}}><div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:20,padding:18}}><div style={{fontWeight:900}}>Mathematics</div><div style={{color:"#8b90a8",fontSize:13,marginTop:6}}>13 Units, 65 lessons — Algebra to Probability.</div></div><div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:20,padding:18}}><div style={{fontWeight:900}}>Physical Sciences</div><div style={{color:"#8b90a8",fontSize:13,marginTop:6}}>14 Units, 70 lessons — 8 Physics + 6 Chemistry.</div></div></div></section>

      <section style={{padding:"20px",maxWidth:520,margin:"0 auto",textAlign:"center"}}><div style={{color:"#22d3ee",fontSize:11,letterSpacing:2,fontWeight:800}}>INSIDE MATRIC360</div><h2 style={{fontSize:22,fontWeight:900,marginTop:8}}>Tools built for real Matric pressure.</h2><div style={{marginTop:16,display:"grid",gap:10,textAlign:"left"}}><div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:18,padding:16}}><div style={{fontWeight:800}}>📊 Adaptive study paths</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>Weak topics bubble up first.</div></div><div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:18,padding:16}}><div style={{fontWeight:800}}>📝 Past-paper practice</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>DBE style with marking guidelines.</div></div><div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:18,padding:16}}><div style={{fontWeight:800}}>🎥 Video lessons 45min avg</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>Unlisted YouTube engine supports 80min+.</div></div></div></section>

      <section style={{padding:"20px",maxWidth:520,margin:"0 auto"}}><div style={{background:"#151a33",border:"1px solid #252a4a",borderRadius:28,padding:20,textAlign:"center"}}><div style={{display:"inline-flex",background:"#1e2340",border:"1px solid #2a3054",borderRadius:999,padding:"6px 12px",fontSize:12}}>🧡 For Parents</div><h2 style={{fontSize:22,fontWeight:900,marginTop:12}}>Know where your child stands before the exam does.</h2><div style={{marginTop:16,display:"grid",gap:10,textAlign:"left"}}><div style={{background:"#0f1224",borderRadius:16,padding:14,border:"1px solid #1e2340"}}><div style={{fontWeight:800}}>Weekly progress visibility</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>See what they study — and avoid.</div></div><div style={{background:"#0f1224",borderRadius:16,padding:14,border:"1px solid #1e2340"}}><div style={{fontWeight:800}}>Weak-topic insights</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>Spot weak topics early.</div></div><div style={{background:"#0f1224",borderRadius:16,padding:14,border:"1px solid #1e2340"}}><div style={{fontWeight:800}}>Exam readiness score</div><div style={{color:"#8b90a8",fontSize:13,marginTop:4}}>Honest weekly readiness per subject.</div></div></div></div></section>

      <section style={{padding:"30px 20px",maxWidth:520,margin:"0 auto",textAlign:"center"}}>
        <div style={{color:"#22d3ee",fontSize:12,letterSpacing:2,fontWeight:800}}>SIMPLE PRICING</div>
        <h2 style={{fontSize:26,fontWeight:900,marginTop:8}}>Start with 2. Grow to 6+.</h2>
        <div style={{marginTop:18,display:"grid",gap:12,textAlign:"left"}}>
          <div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:20,padding:16}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:11,color:"#8b90a8",fontWeight:800}}>FREE</div><div style={{fontSize:24,fontWeight:900}}>R0 <span style={{fontSize:12,color:"#8b90a8"}}>/forever</span></div></div><Link href="/subjects" style={{background:"#1a1e35",border:"1px solid #2a3054",color:"#fff",padding:"8px 14px",borderRadius:10,textDecoration:"none",fontSize:12,fontWeight:700}}>Start Free</Link></div></div>
          {[
            {n:"1 SUBJECT",m:149,y:1490,save:"Save R298",pop:false,best:false},
            {n:"2 SUBJECTS",m:249,y:2490,save:"Most Popular Now — R49 off",pop:true,best:false},
            {n:"3 SUBJECTS",m:300,y:3000,save:"Save R147",pop:false,best:false},
            {n:"4 SUBJECTS",m:350,y:3500,save:"Save R246",pop:false,best:false},
            {n:"5 SUBJECTS",m:400,y:4000,save:"Save R345",pop:false,best:false},
            {n:"6+ SUBJECTS",m:450,y:4500,save:"BEST VALUE • All subjects",pop:false,best:true},
          ].map(p=>(
            <div key={p.n} style={{background:p.pop?"linear-gradient(180deg,#1e1c3a,#151932)":p.best?"linear-gradient(180deg,#1a2e1a,#151932)":"#151932",border:p.pop?"2px solid #fbbf24":p.best?"2px solid #10b981":"1px solid #252a4a",borderRadius:20,padding:16,position:"relative"}}>
              {p.pop&&<div style={{position:"absolute",top:-10,left:16,background:"#fbbf24",color:"#000",fontSize:10,fontWeight:900,padding:"4px 10px",borderRadius:999}}>START HERE</div>}
              {p.best&&<div style={{position:"absolute",top:-10,left:16,background:"#10b981",color:"#000",fontSize:10,fontWeight:900,padding:"4px 10px",borderRadius:999}}>BEST VALUE</div>}
              <div style={{display:"flex",justifyContent:"space-between",marginTop:p.pop||p.best?6:0}}><div><div style={{fontSize:11,color:"#8b90a8",fontWeight:800}}>{p.n}</div><div style={{fontSize:26,fontWeight:900}}>R{p.m}<span style={{fontSize:12,color:"#8b90a8"}}>/mo</span></div><div style={{fontSize:11,color:p.best?"#10b981":"#10b981",fontWeight:700}}>{p.save}</div><div style={{fontSize:11,color:"#6b7280"}}>R{p.y}/yr • 2 months free</div></div><a href={`https://wa.me/27733718447?text=Hi! I want ${p.n} - R${p.m}`} style={{background:p.pop?"#fbbf24":p.best?"#10b981":"#25D366",color:p.pop?"#000":"#fff",padding:"10px 14px",borderRadius:10,textDecoration:"none",fontSize:12,fontWeight:800}}>WhatsApp</a></div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:"20px",maxWidth:520,margin:"0 auto"}}><div style={{textAlign:"center"}}><div style={{color:"#22d3ee",fontSize:11,letterSpacing:2,fontWeight:800}}>FAQ</div><h2 style={{fontSize:22,fontWeight:900,marginTop:8}}>Everything you need to know.</h2></div><div style={{marginTop:14,display:"grid",gap:8}}>{faqs.map(f=><div key={f.q} onClick={()=>setQ(q===f.q?null:f.q)} style={{background:"#151932",border:"1px solid #252a4a",borderRadius:16,padding:14,cursor:"pointer"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:700,fontSize:13}}>{f.q}</span><span style={{color:"#22d3ee"}}>{q===f.q?"−":"+"}</span></div>{q===f.q&&<div style={{color:"#8b90a8",fontSize:12,marginTop:8}}>{f.a}</div>}</div>)}</div></section>

      <section style={{padding:"30px 20px",maxWidth:520,margin:"0 auto"}}><div style={{background:"#151932",border:"1px solid #252a4a",borderRadius:24,padding:24,textAlign:"center"}}><h3 style={{fontWeight:900}}>Follow Matric360 on Facebook</h3><p style={{color:"#8b90a8",fontSize:13,marginTop:6}}>Study tips, exam reminders and CAPS updates.</p><a href="#" style={{marginTop:12,display:"inline-block",background:"#1877f2",color:"#fff",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:700,fontSize:13}}>Follow on Facebook</a></div></section>

      <section style={{padding:"20px",maxWidth:520,margin:"0 auto"}}><div style={{background:"linear-gradient(180deg,#1e2a6a,#151932)",border:"1px solid #2a3a7a",borderRadius:28,padding:24,textAlign:"center"}}><h2 style={{fontSize:26,fontWeight:900}}>Start your Matric360 journey today.</h2><Link href="/subjects" style={{marginTop:16,display:"inline-flex",background:"#fbbf24",color:"#000",padding:"14px 22px",borderRadius:999,textDecoration:"none",fontWeight:900}}>✨ Start Studying Free →</Link></div></section>

      <footer style={{padding:"30px 20px",textAlign:"center",borderTop:"1px solid #1a1e35",marginTop:20}}><div style={{fontWeight:900}}>Matric<span style={{color:"#22d3ee"}}>3</span><span style={{color:"#fbbf24"}}>60</span> — Matric in your Hands</div><div style={{marginTop:8,color:"#4a4f6b",fontSize:11}}>© 2026 Matric360. Built for South African Grade 12 learners. • 13 Maths • 14 Science • 135 Lessons</div></footer>
    </div>
  );
}
