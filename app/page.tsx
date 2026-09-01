export default function Home(){
  return (
    <div style={{minHeight:"100vh", background:"#0e0e14", color:"white", fontFamily:"Inter,sans-serif"}}>
      <header style={{maxWidth:1280, margin:"0 auto", padding:"18px 24px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{width:28, height:28, borderRadius:8, background:"#141423", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #22223a"}}><div style={{width:18, height:18, borderRadius:99, border:"2px solid #7c6cff", borderTopColor:"#f7c948"}}></div></div>
          <span style={{fontWeight:900, fontSize:17}}>Matric<span style={{color:"#7c6cff"}}>3</span><span style={{color:"#f7c948"}}>60</span></span>
        </div>
        <div style={{display:"flex", gap:14, alignItems:"center"}}>
          <a href="/login" style={{color:"#a1a3b8", fontSize:14, textDecoration:"none"}}>Login</a>
          <a href="/login" style={{background:"#fde8b0", color:"#000", padding:"9px 18px", borderRadius:999, fontWeight:800, fontSize:13, textDecoration:"none"}}>Start Free</a>
        </div>
      </header>

      {/* HERO - EXACT LIKE matric360app.co.za */}
      <div style={{maxWidth:1280, margin:"0 auto", padding:"50px 24px 80px", display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:60, alignItems:"center"}}>
        <div>
          <div style={{display:"inline-flex", alignItems:"center", gap:6, fontSize:12, color:"#a1a3b8"}}><span style={{width:6, height:6, background:"#22c55e", borderRadius:99}}></span> CAPS-Aligned · Grade 12</div>
          <h1 style={{fontSize:64, fontWeight:900, lineHeight:0.9, margin:"16px 0 0", letterSpacing:-2.5}}>Master Grade 12<br/>Maths & Physical<br/>Sciences with<br/><span style={{background:"linear-gradient(90deg,#2dd4ff,#a78bfa)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>Confidence</span></h1>
          <p style={{color:"#8b8da3", fontSize:15, maxWidth:420, marginTop:18}}>Start with CAPS-aligned Grade 12 lessons and build progress step by step.</p>
          <div style={{display:"flex", gap:12, marginTop:28}}>
            <a href="/login" style={{background:"#f7c948", color:"#000", padding:"12px 22px", borderRadius:999, fontWeight:800, fontSize:14, textDecoration:"none"}}>✨ Start Studying Free</a>
            <a href="#pricing" style={{background:"#1c1c2a", border:"1px solid #2a2a3e", color:"#fff", padding:"12px 22px", borderRadius:999, fontWeight:600, fontSize:14, textDecoration:"none"}}>▷ See Plans</a>
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"flex-end"}}>
          <div style={{width:380, background:"linear-gradient(180deg,#1a1a2a,#15151f)", border:"1px solid #252538", borderRadius:24, padding:18}}>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:11, color:"#7a7a9a", padding:"0 4px 14px"}}><span>Dashboard</span><span style={{color:"#f7a94a"}}>🔥 5 day streak</span></div>
            <div style={{background:"#1f1f32", border:"1px solid #2a2a42", borderRadius:16, padding:14, marginBottom:12}}><div style={{fontSize:11, color:"#8b8da3"}}>Exam Readiness</div><div style={{display:"flex", gap:8, alignItems:"baseline", marginTop:4}}><span style={{fontSize:26, fontWeight:900, color:"#2ee89e"}}>75%</span><span style={{fontSize:11, color:"#2ee89e"}}>On track</span></div><div style={{height:6, background:"#0e0e14", borderRadius:99, marginTop:10}}><div style={{height:"100%", width:"75%", background:"linear-gradient(90deg,#2aa8ff,#a78bfa)", borderRadius:99}}></div></div></div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12}}><div style={{background:"#1f1f32", border:"1px solid #2a2a42", borderRadius:14, padding:12}}><div style={{fontSize:9, color:"#8b8da3"}}>LEVEL</div><div style={{fontSize:18, fontWeight:900}}>12</div><div style={{fontSize:10, color:"#2ee89e"}}>+240 XP today</div></div><div style={{background:"#1f1f32", border:"1px solid #2a2a42", borderRadius:14, padding:12}}><div style={{fontSize:9, color:"#8b8da3"}}>GOAL</div><div style={{fontSize:16, fontWeight:900}}>100 XP</div><div style={{fontSize:10, color:"#2ee89e"}}>Almost there</div></div></div>
            <div style={{background:"#1f1f32", border:"1px solid #2a2a42", borderRadius:14, padding:12, marginBottom:12}}><div style={{fontSize:9, color:"#2dd4ff", fontWeight:800}}>✦ RECOMMENDED</div><div style={{fontSize:13, fontWeight:800, marginTop:4}}>Calculus - Paper 1 Prep</div><div style={{fontSize:11, color:"#8b8da3"}}>5 lessons · 12 min</div></div>
            <div style={{background:"linear-gradient(180deg,#2a2216,#221d14)", border:"1px solid #3a3222", borderRadius:14, padding:12}}><div style={{fontSize:11, color:"#f7c948", fontWeight:700}}>◍ Daily streak</div><div style={{fontSize:11, color:"#a89a7a", marginTop:4}}>Keep your streak alive — complete one lesson today.</div></div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how" style={{maxWidth:1280, margin:"0 auto", padding:"0 24px 60px", textAlign:"center"}}>
        <h2 style={{fontSize:26, fontWeight:900}}>See how Matric360 works</h2>
        <p style={{color:"#8b8da3", fontSize:13, maxWidth:600, margin:"10px auto 28px"}}>Daily practice, past papers, mock exams and progress tracking — everything Grade 12.</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:16, textAlign:"left"}}>
          <div style={{background:"#171722", border:"1px solid #252538", borderRadius:16, padding:18}}><div>🎯</div><b>1. Diagnose</b><div style={{fontSize:12, color:"#8b8da3", marginTop:6}}>Find gaps in 10 mins.</div></div>
          <div style={{background:"#171722", border:"1px solid #252538", borderRadius:16, padding:18}}><div>📘</div><b>2. Practice</b><div style={{fontSize:12, color:"#8b8da3", marginTop:6}}>CAPS-aligned with XP.</div></div>
          <div style={{background:"#171722", border:"1px solid #252538", borderRadius:16, padding:18}}><div>📄</div><b>3. Past Papers</b><div style={{fontSize:12, color:"#8b8da3", marginTop:6}}>DBE papers + memos.</div></div>
          <div style={{background:"#171722", border:"1px solid #252538", borderRadius:16, padding:18}}><div>🏆</div><b>4. Mock Exams</b><div style={{fontSize:12, color:"#8b8da3", marginTop:6}}>Full exam sim.</div></div>
        </div>
      </div>

      {/* YOUR PRICING - R149 to 6 SUBJECTS */}
      <div id="pricing" style={{maxWidth:1280, margin:"0 auto", padding:"0 24px 100px"}}>
        <div style={{textAlign:"center", marginBottom:32}}>
          <h2 style={{fontSize:28, fontWeight:900}}>Simple pricing for every Grade 12</h2>
          <p style={{color:"#8b8da3", fontSize:13, marginTop:8}}>Start at R149 — up to 6 subjects. No hidden fees.</p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, maxWidth:1000, margin:"0 auto"}}>
          {/* R149 */}
          <div style={{background:"#171722", border:"1px solid #252538", borderRadius:20, padding:20}}>
            <div style={{fontSize:12, color:"#8b8da3", letterSpacing:1}}>STARTER</div>
            <div style={{fontSize:32, fontWeight:900, marginTop:8}}>R149<span style={{fontSize:14, color:"#8b8da3", fontWeight:400}}>/mo</span></div>
            <div style={{fontSize:12, color:"#a1a3b8", marginTop:4}}>1 Subject</div>
            <ul style={{fontSize:12, color:"#8b8da3", marginTop:16, lineHeight:1.8, paddingLeft:16}}>
              <li>Choose Maths OR Physics</li>
              <li>All CAPS lessons</li>
              <li>Past papers + memos</li>
              <li>Daily XP & streaks</li>
            </ul>
            <a href="/login" style={{display:"block", textAlign:"center", marginTop:18, background:"#1f1f32", border:"1px solid #2a2a42", color:"#fff", padding:"10px", borderRadius:999, textDecoration:"none", fontWeight:700, fontSize:13}}>Start with 1 subject</a>
          </div>
          {/* R249 POPULAR */}
          <div style={{background:"linear-gradient(180deg,#1e1c2e,#171722)", border:"1px solid #7c6cff", borderRadius:20, padding:20, transform:"scale(1.03)", boxShadow:"0 10px 40px rgba(124,108,255,0.2)"}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><span style={{fontSize:12, color:"#a78bfa", letterSpacing:1}}>MOST POPULAR</span><span style={{fontSize:10, background:"#7c6cff", color:"#fff", padding:"2px 8px", borderRadius:99}}>SAVE 30%</span></div>
            <div style={{fontSize:32, fontWeight:900, marginTop:8}}>R249<span style={{fontSize:14, color:"#8b8da3", fontWeight:400}}>/mo</span></div>
            <div style={{fontSize:12, color:"#a1a3b8", marginTop:4}}>3 Subjects</div>
            <ul style={{fontSize:12, color:"#c5c6d9", marginTop:16, lineHeight:1.8, paddingLeft:16}}>
              <li>Maths + Physical Sciences + 1 more</li>
              <li>Everything in Starter</li>
              <li>Mock exams & readiness score</li>
              <li>Priority support</li>
            </ul>
            <a href="/login" style={{display:"block", textAlign:"center", marginTop:18, background:"#f7c948", color:"#000", padding:"10px", borderRadius:999, textDecoration:"none", fontWeight:800, fontSize:13}}>Get 3 subjects</a>
          </div>
          {/* R349 - 6 SUBJECTS */}
          <div style={{background:"#171722", border:"1px solid #252538", borderRadius:20, padding:20}}>
            <div style={{fontSize:12, color:"#f7c948", letterSpacing:1}}>COMPLETE MATRIC</div>
            <div style={{fontSize:32, fontWeight:900, marginTop:8}}>R349<span style={{fontSize:14, color:"#8b8da3", fontWeight:400}}>/mo</span></div>
            <div style={{fontSize:12, color:"#a1a3b8", marginTop:4}}>6 Subjects</div>
            <ul style={{fontSize:12, color:"#8b8da3", marginTop:16, lineHeight:1.8, paddingLeft:16}}>
              <li>All Grade 12 subjects unlocked</li>
              <li>Full diagnostic + study plan</li>
              <li>Unlimited mock exams</li>
              <li>Parent progress reports</li>
            </ul>
            <a href="/login" style={{display:"block", textAlign:"center", marginTop:18, background:"#1f1f32", border:"1px solid #2a2a42", color:"#fff", padding:"10px", borderRadius:999, textDecoration:"none", fontWeight:700, fontSize:13}}>Unlock 6 subjects</a>
          </div>
        </div>
      </div>

      <div style={{borderTop:"1px solid #1e1e2e", padding:"24px", textAlign:"center", color:"#5a5c78", fontSize:12}}>© 2026 Matric360 — CAPS-Aligned • R149 to R349</div>
    </div>
  )
}
