"use client";
import Link from "next/link";

export default function Page(){
  return(
    <div style={{background:"#0a0d1a", minHeight:"100vh", color:"white", fontFamily:"Inter, sans-serif"}}>
      {/* HEADER */}
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px", background:"#0f1020"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src="/logo.png" alt="Matric360" style={{width:36,height:36,borderRadius:8}}/>
          <div style={{fontWeight:800,fontSize:19}}>Matric<span style={{color:"#38bdf8"}}>3</span><span style={{color:"#fbbf24"}}>60</span></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Link href="/login" style={{color:"#cbd5e1",textDecoration:"none",fontSize:14}}>Login</Link>
          <Link href="/signup" style={{background:"#fbbf24",color:"black",padding:"10px 18px",borderRadius:999,fontWeight:800,textDecoration:"none",fontSize:14}}>Start Free</Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{padding:"32px 20px 20px", textAlign:"center"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#1a1c32",border:"1px solid #2a2c4a",padding:"6px 14px",borderRadius:999,fontSize:12, color:"#cbd5e1"}}>
          <span style={{width:8,height:8,background:"#10b981",borderRadius:999,display:"inline-block",boxShadow:"0 0 8px #10b981"}}></span>
          CAPS-Aligned · Grade 12
        </div>
        <h1 style={{fontSize:36,fontWeight:900,lineHeight:1.15,marginTop:20}}>
          Master Grade 12 Maths<br/>& Physical Sciences<br/>with <span style={{background:"linear-gradient(90deg,#38bdf8,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Confidence</span>
        </h1>
        <p style={{color:"#94a3b8",marginTop:14,fontSize:14,lineHeight:1.5}}>Start with CAPS-aligned Grade 12 lessons and build progress step by step.</p>
        
        <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:24}}>
          <Link href="/signup" style={{background:"#fbbf24",color:"black",padding:"16px",borderRadius:16,fontWeight:800,textDecoration:"none",display:"flex",justifyContent:"center",gap:8,boxShadow:"0 0 30px rgba(251,191,36,0.3)"}}>✨ Start Studying Free</Link>
          <Link href="#how" style={{background:"#1e2035",color:"white",padding:"14px",borderRadius:16,fontWeight:600,textDecoration:"none",border:"1px solid #2d304f",display:"flex",justifyContent:"center",gap:8}}>▶ See How It Works</Link>
        </div>
      </section>

      {/* DASHBOARD PREVIEW - like photo */}
      <section style={{padding:"20px 16px 40px"}}>
        <div style={{background:"linear-gradient(180deg,#1a1c32,#141627)",borderRadius:28,padding:12,border:"1px solid #2a2d4a"}}>
          <div style={{background:"#0f111f",borderRadius:20,padding:16,border:"1px solid #1e2035"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",color:"#94a3b8",fontSize:12,marginBottom:16}}>
              <span>Dashboard</span>
              <span style={{color:"#fbbf24",display:"flex",alignItems:"center",gap:4}}>🔥 5 day streak</span>
            </div>
            <div style={{background:"#1a1c32",borderRadius:20,padding:16,border:"1px solid #2a2c4a"}}>
              <div style={{color:"#94a3b8",fontSize:12}}>Exam Readiness</div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:4}}>
                <span style={{fontSize:28,fontWeight:900,color:"#10b981"}}>75%</span>
                <span style={{fontSize:12,color:"#10b981"}}>On track</span>
              </div>
              <div style={{height:6,background:"#2a2d4a",borderRadius:999,marginTop:12,overflow:"hidden"}}>
                <div style={{width:"75%",height:"100%",background:"linear-gradient(90deg,#3b82f6,#a855f7)",borderRadius:999}}></div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
              <div style={{background:"#1a1c32",borderRadius:16,padding:14,border:"1px solid #2a2c4a"}}>
                <div style={{color:"#94a3b8",fontSize:10,letterSpacing:1}}>LEVEL</div>
                <div style={{fontWeight:800,fontSize:18,marginTop:4}}>12</div>
                <div style={{color:"#38bdf8",fontSize:10,marginTop:4}}>+240 XP today</div>
              </div>
              <div style={{background:"#1a1c32",borderRadius:16,padding:14,border:"1px solid #2a2c4a"}}>
                <div style={{color:"#94a3b8",fontSize:10,letterSpacing:1}}>GOAL</div>
                <div style={{fontWeight:800,fontSize:18,marginTop:4}}>100 XP</div>
                <div style={{color:"#10b981",fontSize:10,marginTop:4}}>Almost there</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
