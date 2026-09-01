export default function Home(){
  return (
    <div style={{minHeight:"100vh", background:"#0e0e14", color:"white", fontFamily:"Inter, sans-serif"}}>
      {/* HEADER */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        
        {/* LOGO - SQUEEZE FIX INSIDE */}
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <div style={{width:28, height:28, borderRadius:8, overflow:"hidden", background:"#0e0e14", flexShrink:0}}>
            <img 
              src="/logo.png" 
              alt="Matric360" 
              style={{
                width:140, 
                height:70, 
                objectFit:"cover", 
                objectPosition:"left center", 
                marginLeft:-6, 
                marginTop:-2,
                transform:"scale(1.8)",
                transformOrigin:"left center"
              }} 
            />
          </div>
          <span style={{fontWeight:900}}>Matric<span style={{color:"#7c6cff"}}>3</span><span style={{color:"#f7c948"}}>60</span></span>
        </div>

        <div style={{display:"flex", gap:12, alignItems:"center"}}>
          <a href="/login" style={{fontSize:14, color:"#a1a3b8", textDecoration:"none"}}>Login</a>
          <a href="/login" style={{background:"#fde8b0", color:"#000", padding:"8px 16px", borderRadius:999, fontSize:13, fontWeight:800, textDecoration:"none"}}>Start Free</a>
        </div>
      </div>

      {/* HERO - DESKTOP SPLIT */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"40px 24px", display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:40, alignItems:"center"}}>
        {/* LEFT */}
        <div>
          <div style={{fontSize:11, letterSpacing:2, color:"#a1a3b8", marginBottom:16}}>● CAPS-Aligned · Grade 12</div>
          <h1 style={{fontSize:56, fontWeight:900, lineHeight:0.95, margin:0}}>
            Master Grade 12<br/>Maths & Physical<br/>Sciences with<br/>
            <span style={{background:"linear-gradient(90deg,#2dd4ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Confidence</span>
          </h1>
          <p style={{color:"#8b8da3", marginTop:16, maxWidth:440}}>Start with CAPS-aligned Grade 12 lessons and build progress step by step.</p>
          <div style={{display:"flex", gap:12, marginTop:24}}>
            <a href="/login" style={{background:"#f7c948", color:"#000", padding:"12px 20px", borderRadius:999, fontWeight:800, fontSize:14, textDecoration:"none"}}>✨ Start Studying Free</a>
            <a href="#how" style={{background:"#1e1e2e", border:"1px solid #2a2a3e", color:"#fff", padding:"12px 20px", borderRadius:999, fontWeight:700, fontSize:14, textDecoration:"none"}}>▷ See How It Works</a>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div style={{display:"flex", justifyContent:"flex-end"}}>
          <div style={{width:380, background:"#1a1a28", border:"1px solid #2a2a3e", borderRadius:20, padding:20}}>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:11, color:"#8b8da3"}}><span>Dashboard</span><span style={{color:"#f7c948"}}>🔥 5 day streak</span></div>
            <div style={{background:"#24243a", borderRadius:12, padding:14, marginTop:12}}>
              <div style={{fontSize:11, color:"#8b8da3"}}>Exam Readiness</div>
              <div style={{fontSize:28, fontWeight:900, color:"#2ee89e"}}>75% <span style={{fontSize:11, color:"#8b8da3", fontWeight:400}}>On track</span></div>
            </div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10}}>
              <div style={{background:"#24243a", borderRadius:12, padding:12}}><div style={{fontSize:10, color:"#8b8da3"}}>LEVEL</div><div style={{fontWeight:900}}>12</div></div>
              <div style={{background:"#24243a", borderRadius:12, padding:12}}><div style={{fontSize:10, color:"#8b8da3"}}>GOAL</div><div style={{fontWeight:900}}>100 XP</div></div>
            </div>
            <div style={{background:"#24243a", borderRadius:12, padding:12, marginTop:10}}>
              <div style={{fontSize:10, color:"#2dd4ff"}}>RECOMMENDED</div>
              <div style={{fontSize:13, fontWeight:700}}>Calculus - Paper 1 Prep</div>
              <div style={{fontSize:11, color:"#8b8da3"}}>5 lessons · 12 min</div>
            </div>
          </div>
        </div>
      </div>

      <div id="how" style={{textAlign:"center", padding:"20px 24px 80px"}}>
        <h2 style={{fontSize:22, fontWeight:900}}>See how Matric360 works</h2>
        <p style={{fontSize:13, color:"#8b8da3", maxWidth:600, margin:"8px auto 0"}}>A quick tour of daily practice, past papers, mock exams and progress tracking.</p>
      </div>
    </div>
  )
}
