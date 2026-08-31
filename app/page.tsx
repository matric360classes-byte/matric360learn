"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Page(){
  const [q,setQ]=useState<string|null>(null);
  const [menuOpen,setMenuOpen]=useState(false);
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
    <div style={{background:"#f6fff8",minHeight:"100vh",color:"#0a0d1f"}}>
      <header style={{display:"flex",justifyContent:"space-between",padding:"14px 16px",alignItems:"center", background:"white", borderBottom:"1px solid #e5e7eb", position:"sticky", top:0, zIndex:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setMenuOpen(true)} style={{fontSize:22, background:"none", border:"none", color:"#0a0d1f", cursor:"pointer"}}>☰</button>
          <img src="/logo.png" alt="Matric360" style={{width:32,height:32,borderRadius:8}}/>
          <div style={{fontWeight:800,fontSize:18, color:"#0a0d1f"}}>Matric360</div>
        </div>
        <div style={{background:"#16a34a",color:"white",padding:"8px 14px",borderRadius:20,fontWeight:700,fontSize:14}}>Learn</div>
      </header>
      <section style={{padding:"32px 20px", background:"white"}}>
        <h1 style={{fontSize:32,fontWeight:900,lineHeight:1.1, color:"#0a0d1f"}}>Pass Matric<br/><span style={{color:"#16a34a"}}>With Confidence</span></h1>
        <p style={{color:"#6b7280",marginTop:10}}>Your original landing - 2 Subjects only</p>
      </section>
      <section style={{padding:"16px", background:"#f6fff8"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{background:"white", padding:16, borderRadius:16, border:"1px solid #dcfce7"}}>
            <div style={{fontSize:20}}>∑</div>
            <div style={{fontWeight:800,marginTop:6}}>Mathematics</div>
            <div style={{fontSize:12,color:"#666"}}>13 Units • CAPS</div>
          </div>
          <div style={{background:"white", padding:16, borderRadius:16, border:"1px solid #dcfce7"}}>
            <div style={{fontSize:20}}>🧪</div>
            <div style={{fontWeight:800,marginTop:6}}>Physical Sciences</div>
            <div style={{fontSize:12,color:"#666"}}>12 Units • CAPS</div>
          </div>
        </div>
      </section>
      <section style={{padding:"20px",background:"white", marginTop:12}}>
        <h2 style={{fontWeight:800,fontSize:20, marginBottom:12, color:"#0a0d1f"}}>FAQ</h2>
        {faqs.map(f=>(
          <div key={f.q} style={{borderBottom:"1px solid #f3f4f6",padding:"14px 0"}}>
            <button onClick={()=>setQ(q===f.q?null:f.q)} style={{width:"100%",textAlign:"left",fontWeight:600,display:"flex",justifyContent:"space-between",background:"none",border:"none",cursor:"pointer", color:"#0a0d1f"}}>{f.q}<span style={{color:"#16a34a"}}>{q===f.q?"−":"+"}</span></button>
            {q===f.q&&<p style={{color:"#6b7280",fontSize:14,marginTop:8}}>{f.a}</p>}
          </div>
        ))}
      </section>
      <footer style={{padding:20,textAlign:"center",color:"#9ca3af",fontSize:12, background:"white", borderTop:"1px solid #f3f4f6"}}>© 2026 Matric360Learn</footer>
      <Sidebar open={menuOpen} onClose={()=>setMenuOpen(false)} />
    </div>
  )
}
