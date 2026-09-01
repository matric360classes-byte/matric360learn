"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{background:"#0a0a0c", minHeight:"100vh", color:"white"}}>
      {/* HEADER */}
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", maxWidth:1280, margin:"0 auto"}}>
        <div style={{display:"flex", alignItems:"center", gap:10, fontWeight:700}}>
          <img src="/logo.png" alt="logo" style={{width:32, height:32, borderRadius:8}} />
          Matric360
        </div>
        <div style={{display:"flex", gap:12}}>
          <Link href="/login" style={{color:"white", textDecoration:"none", padding:"8px 16px"}}>Log in</Link>
          <Link href="/login" style={{background:"#f5c88a", color:"black", padding:"8px 18px", borderRadius:999, textDecoration:"none", fontWeight:600}}>Start Free</Link>
        </div>
      </header>

      {/* HERO - ONLY THIS PART IS FIXED - LEFT ON DESKTOP, 75% ON RIGHT LIKE YOUR PHOTO */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"60px 24px"}}>
        <style>{`
          .hero-wrap{display:grid; gap:40px}
          @media(min-width:1024px){
            .hero-wrap{grid-template-columns:1.15fr 0.85fr; align-items:center}
            .hero-left{text-align:left !important; align-items:flex-start !important}
            .hero-left .hero-btns{justify-content:flex-start !important}
          }
        `}</style>
        
        <div className="hero-wrap">
          {/* LEFT */}
          <div className="hero-left" style={{display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center"}}>
            <div style={{display:"inline-flex", alignItems:"center", gap:8, background:"#15151a", border:"1px solid #2a2a30", padding:"6px 12px", borderRadius:999, fontSize:13, marginBottom:20}}>
              <span style={{width:8, height:8, background:"#22c55e", borderRadius:999}}></span> CAPS-Aligned · Grade 12
            </div>
            <h1 style={{fontSize:"clamp(36px,6vw,68px)", lineHeight:"0.95", fontWeight:800, margin:0}}>
              Master Grade 12<br/>Maths & Physical<br/>Sciences with<br/>
              <span style={{background:"linear-gradient(90deg,#22d3ee,#a855f7)", WebkitBackgroundClip:"text", color:"transparent"}}>Confidence</span>
            </h1>
            <p style={{color:"#9ca3af", fontSize:18, marginTop:20, maxWidth:520}}>
              Start with CAPS-aligned Grade 12 lessons and build progress step by step.
            </p>
            <div className="hero-btns" style={{display:"flex", gap:12, marginTop:28, justifyContent:"center", flexWrap:"wrap"}}>
              <Link href="/login" style={{background:"#f5c88a", color:"black", padding:"12px 22px", borderRadius:999, textDecoration:"none", fontWeight:600}}>Start Studying Free</Link>
              <Link href="#how" style={{border:"1px solid #2a2a30", color:"white", padding:"12px 22px", borderRadius:999, textDecoration:"none"}}>See How It Works</Link>
            </div>
          </div>

          {/* RIGHT - 75% CARD EXACTLY LIKE PHOTO */}
          <div style={{display:"flex", justifyContent:"center"}}>
            <div style={{background:"#16161a", border:"1px solid #2a2a30", borderRadius:24, padding:20, width:"100%", maxWidth:380}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
                <span style={{color:"#9ca3af"}}>Overall Progress</span>
                <span style={{background:"#f5c88a", color:"black", padding:"4px 10px", borderRadius:999, fontSize:13, fontWeight:700}}>75%</span>
              </div>
              <div style={{height:8, background:"#2a2a30", borderRadius:999, marginBottom:20}}>
                <div style={{width:"75%", height:"100%", background:"#f5c88a", borderRadius:999}}></div>
              </div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16}}>
                <div style={{background:"#1f1f24", padding:12, borderRadius:16}}><div style={{fontSize:22, fontWeight:700}}>12</div><div style={{fontSize:12, color:"#9ca3af"}}>Lessons Done</div></div>
                <div style={{background:"#1f1f24", padding:12, borderRadius:16}}><div style={{fontSize:22, fontWeight:700}}>100 XP</div><div style={{fontSize:12, color:"#9ca3af"}}>Earned</div></div>
              </div>
              <div style={{background:"#1f1f24", padding:12, borderRadius:16, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div><div style={{fontWeight:600}}>Calculus</div><div style={{fontSize:12, color:"#9ca3af"}}>Mathematics • 80%</div></div>
                <div style={{width:32, height:32, borderRadius:999, background:"#2a2a30"}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EVERYTHING BELOW STAYS SAME - YOU CAN KEEP YOUR ORIGINAL SECTIONS HERE */}
      {/* Subjects, Pricing R149/R249/R349, Footer etc - don't delete them, just keep below this hero */}
    </div>
  );
}
