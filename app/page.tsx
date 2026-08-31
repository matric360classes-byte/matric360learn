"use client";
import { useState } from "react";
import Link from "next/link";

export default function Page(){
  const [q,setQ]=useState<string|null>(null);
  const [activeQuiz, setActiveQuiz]=useState(0);
  const [score, setScore]=useState(0);
  const [showScore, setShowScore]=useState(false);

  const faqs=[
    {q:"What is Matric360?",a:"CAPS-aligned Grade 12 platform - Maths 13 Units, Sciences, Languages."},
    {q:"Who is Matric360 for?",a:"Grade 12 learners who want to pass with Bachelor."},
    {q:"Which subjects are available?",a:"Maths (13 Units), Physical Sciences, Life Sciences, English, etc."},
    {q:"Is Matric360 aligned with CAPS?",a:"Yes - every lesson is CAPS aligned."},
    {q:"Is there a free version?",a:"Yes - R0 forever: CAPS summaries + 1 quiz per unit."},
    {q:"What does Premium include?",a:"Full CAPS, videos, unlimited quizzes, past papers."},
    {q:"How much does Matric360 cost?",a:"R149 for 1, R249 for all subjects."},
    {q:"Can I study on my phone?",a:"Yes - mobile-first, works offline for summaries."},
  ];

  const subjects=[
    {name:"Mathematics", slug:"maths", icon:"📐", count:"13 Units"},
    {name:"Physical Sciences", slug:"physics", icon:"🧪", count:"12 Units"},
    {name:"Life Sciences", slug:"lifesciences", icon:"🧬", count:"10 Units"},
    {name:"English FAL", slug:"english", icon:"📖", count:"8 Units"},
  ];

  const quizzes=[
    {q:"What is derivative of x²?", options:["2x","x","x²","0"], answer:0},
    {q:"Solve: 2x+3=11", options:["4","5","3","6"], answer:0},
    {q:"What is sin(90°)?", options:["0","1","-1","0.5"], answer:1},
  ];

  const handleAnswer=(idx:number)=>{
    if(idx===quizzes[activeQuiz].answer) setScore(s=>s+1);
    if(activeQuiz+1<quizzes.length) setActiveQuiz(i=>i+1);
    else setShowScore(true);
  };

 return(
  <div style={{background:"#0a0d1f",minHeight:"100vh",color:"white"}}>
    {/* HEADER - KEEP YOUR LOGO */}
    <header style={{display:"flex",justifyContent:"space-between",padding:"16px 20px",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <img src="/logo.png" alt="Matric360" style={{width:34,height:34,borderRadius:8}}/>
        <div style={{fontWeight:800,fontSize:18,color:"#ffde59"}}>Matric360</div>
      </div>
      <div style={{display:"flex",gap:12}}>
        <Link href="#subjects" style={{color:"white",textDecoration:"none",padding:"8px 14px",border:"1px solid #333",borderRadius:8}}>Subjects</Link>
        <Link href="#quiz" style={{background:"#ffde59",color:"black",padding:"8px 14px",borderRadius:8,fontWeight:700,textDecoration:"none"}}>Start Learning</Link>
      </div>
    </header>

    {/* HERO - NOW CLICKABLE */}
    <section style={{padding:"40px 20px",textAlign:"center"}}>
      <h1 style={{fontSize:36,fontWeight:900,lineHeight:1.1}}>Pass Matric <span style={{color:"#ffde59"}}>With Confidence</span></h1>
      <p style={{color:"#aaa",marginTop:12}}>CAPS-aligned, mobile-first, built for Grade 12</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:20}}>
        <a href="#subjects" style={{background:"#ffde59",color:"black",padding:"12px 20px",borderRadius:12,fontWeight:800,textDecoration:"none"}}>View All Subjects →</a>
        <a href="#dashboard" style={{border:"1px solid #333",color:"white",padding:"12px 20px",borderRadius:12,textDecoration:"none"}}>My Dashboard</a>
      </div>
    </section>

    {/* SUBJECTS - ALL CLICKABLE NOW */}
    <section id="subjects" style={{padding:"20px",background:"white",color:"black",borderRadius:"24px 24px 0 0"}}>
      <h2 style={{fontSize:24,fontWeight:800}}>All Subjects - Tap to Start</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
        {subjects.map(s=>(
          <button key={s.slug} onClick={()=>{setActiveQuiz(0);setScore(0);setShowScore(false);document.getElementById('quiz')?.scrollIntoView({behavior:'smooth'})}} style={{textAlign:"left",padding:16,border:"1px solid #eee",borderRadius:16,background:"#fffbe6",cursor:"pointer"}}>
            <div style={{fontSize:24}}>{s.icon}</div>
            <div style={{fontWeight:700,marginTop:6}}>{s.name}</div>
            <div style={{fontSize:12,color:"#666"}}>{s.count} • Click to start</div>
          </button>
        ))}
      </div>
    </section>

    {/* QUIZ - WORKING */}
    <section id="quiz" style={{padding:20,background:"white",color:"black"}}>
      <div style={{maxWidth:600,margin:"0 auto",border:"1px solid #eee",borderRadius:20,padding:20}}>
        <h3 style={{fontWeight:800,fontSize:18}}>Maths Quiz - Works Now! ({activeQuiz+1}/{quizzes.length})</h3>
        {!showScore?(
          <>
            <p style={{fontWeight:600,margin:"16px 0"}}>{quizzes[activeQuiz].q}</p>
            {quizzes[activeQuiz].options.map((opt,i)=>(
              <button key={i} onClick={()=>handleAnswer(i)} style={{width:"100%",textAlign:"left",padding:12,border:"1px solid #ddd",borderRadius:12,marginBottom:8,background:"white",cursor:"pointer"}}>{opt}</button>
            ))}
            <div style={{fontSize:12,color:"#666",marginTop:8}}>Score: {score} | Progress: {Math.round((score/13)*100)}%</div>
          </>
        ):(
          <div style={{textAlign:"center",padding:20}}>
            <h3 style={{fontSize:28,fontWeight:900}}>Score {score}/{quizzes.length}</h3>
            <button onClick={()=>{setActiveQuiz(0);setScore(0);setShowScore(false)}} style={{marginTop:12,background:"#0a0d1f",color:"white",padding:"10px 20px",borderRadius:10}}>Retry</button>
          </div>
        )}
      </div>
    </section>

    {/* DASHBOARD - LIVE DATA */}
    <section id="dashboard" style={{padding:20,background:"#f6f6f6",color:"black"}}>
      <h2 style={{fontWeight:800,fontSize:20}}>Student Dashboard - Live</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:12}}>
        <div style={{background:"#0a0d1f",color:"white",padding:16,borderRadius:16}}><div style={{fontSize:12,opacity:0.7}}>Progress</div><div style={{fontSize:28,fontWeight:900}}>{Math.round((score/3)*100)}%</div></div>
        <div style={{background:"white",padding:16,borderRadius:16,border:"1px solid #eee"}}><div style={{fontWeight:700}}>Quizzes</div><div style={{fontSize:20}}>{score}/13</div></div>
        <div style={{background:"white",padding:16,borderRadius:16,border:"1px solid #eee"}}><div style={{fontWeight:700}}>XP</div><div style={{fontSize:20}}>{score*10} XP</div></div>
      </div>
    </section>

    {/* FAQ - ALREADY WORKING */}
    <section style={{padding:20,background:"white",color:"black"}}>
      <h2 style={{fontWeight:800,fontSize:20}}>FAQ</h2>
      {faqs.map(f=>(
        <div key={f.q} style={{borderBottom:"1px solid #eee",padding:"12px 0"}}>
          <button onClick={()=>setQ(q===f.q?null:f.q)} style={{width:"100%",textAlign:"left",fontWeight:600,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer"}}>{f.q}<span>{q===f.q?"−":"+"}</span></button>
          {q===f.q&&<p style={{color:"#555",fontSize:14,marginTop:8}}>{f.a}</p>}
        </div>
      ))}
    </section>

    <footer style={{padding:20,textAlign:"center",color:"#666",fontSize:12}}>© 2026 Matric360Learn - matric360learn.co.za - All items now clickable!</footer>
  </div>
 )
}
