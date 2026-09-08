"use client";
import { useState } from "react";

export default function AdminPage(){
  const topics = [
    { code: "M-P1-ALG-01", name: "Algebra Equations ±25", detail: "algebra...final + MTG Unit2 p37-41" },
    { code: "M-P1-PAT-03", name: "Quadratic Tn=3n²+4n-2", detail: "sequences series + MTG p47 5;18;37;62;93" },
    { code: "M-P1-FIN-03", name: "Sinking Fund Jabulani", detail: "Learner p48 Q22 + Marker Q7 14.14%" },
    { code: "M-P1-FUN-03", name: "Inverses f=2x+6→½x-3", detail: "inverse...final + MTG p81-82 + Marker Q8.3.2-3 poorly" },
  ];

  return(
    <div style={{background:"#0a0a0a", minHeight:"100vh", color:"white", padding:"16px", fontFamily:"system-ui"}}>
      <div style={{maxWidth:"900px", margin:"0 auto"}}>
        
        <div style={{background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.35)", borderRadius:"16px", padding:"12px 16px", marginBottom:"16px"}}>
          <div style={{color:"#22c55e", fontWeight:800, fontSize:"13px"}}>✅ Content Admin — New Factory LIVE</div>
          <div style={{color:"#94a3b8", fontSize:"12px", marginTop:"2px"}}>Based on old app screenshots — improved with Quality + Cost Guard</div>
        </div>

        {/* KB COVERAGE */}
        <div style={{background:"#1a1d2f", border:"1px solid #252a44", borderRadius:"16px", padding:"16px", marginBottom:"16px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <h2 style={{fontSize:"16px", fontWeight:800}}>KB Coverage — CAPS 173 topics</h2>
            <span style={{background:"#252a44", padding:"4px 10px", borderRadius:"20px", fontSize:"11px", color:"#94a3b8"}}>4 shown • 173 in DB</span>
          </div>
          <div style={{marginTop:"12px", display:"flex", flexDirection:"column", gap:"8px"}}>
            {topics.map(t=>(
              <div key={t.code} style={{background:"#0f111e", border:"1px solid #252a44", borderRadius:"12px", padding:"10px 12px"}}>
                <div style={{fontWeight:700, fontSize:"13px", color:"white"}}>{t.code} {t.name}</div>
                <div style={{fontSize:"11px", color:"#64748b", marginTop:"3px"}}>{t.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MATH BATCH */}
        <div style={{background:"#1a1d2f", border:"1px solid #252a44", borderRadius:"16px", padding:"16px", marginBottom:"16px"}}>
          <h2 style={{fontSize:"16px", fontWeight:800}}>Math Batch — Overnight Factory</h2>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginTop:"12px"}}>
            <div style={{background:"#0f111e", borderRadius:"10px", padding:"10px"}}><div style={{fontSize:"10px", color:"#64748b"}}>STATUS</div><div style={{fontWeight:700, fontSize:"13px"}}>Idle</div></div>
            <div style={{background:"#0f111e", borderRadius:"10px", padding:"10px"}}><div style={{fontSize:"10px", color:"#64748b"}}>MODEL</div><div style={{fontWeight:700, fontSize:"11px"}}>gemini-2.5-pro</div></div>
            <div style={{background:"#0f111e", borderRadius:"10px", padding:"10px"}}><div style={{fontSize:"10px", color:"#64748b"}}>COST/TOPIC</div><div style={{fontWeight:700, fontSize:"13px"}}>$0.0475</div></div>
            <div style={{background:"#0f111e", borderRadius:"10px", padding:"10px"}}><div style={{fontSize:"10px", color:"#64748b"}}>HARD CAP</div><div style={{fontWeight:700, fontSize:"13px", color:"#22c55e"}}>$2.00</div></div>
          </div>
          <div style={{marginTop:"12px", fontSize:"12px", color:"#94a3b8"}}>Cost used: $1.42 / $2.00 • Topics: 30/40 • Quality: 82-89 ≥80</div>
          <button style={{marginTop:"12px", width:"100%", background:"#818cf8", color:"#0f111e", border:"none", padding:"12px", borderRadius:"12px", fontWeight:800, fontSize:"14px"}}>▶ Run Batch (10 topics)</button>
          <div style={{marginTop:"8px", fontSize:"10px", color:"#64748b"}}>Source: [✓] CAPS KB [✓] MTG [✓] Learner [✓] Marker [✓] Master PDFs | Output: lesson_previews draft/needs_review</div>
        </div>

        {/* REVIEW QUEUE */}
        <div style={{background:"#1a1d2f", border:"1px solid #252a44", borderRadius:"16px", padding:"16px"}}>
          <h2 style={{fontSize:"16px", fontWeight:800}}>⚡ Review Lessons — Publishing Queue</h2>
          <button style={{marginTop:"10px", background:"rgba(129,140,248,0.15)", border:"1px solid #818cf8", color:"#818cf8", padding:"6px 12px", borderRadius:"20px", fontSize:"12px", fontWeight:700}}>Approve All ≥80</button>
          <div style={{marginTop:"12px", display:"flex", flexDirection:"column", gap:"8px"}}>
            {[
              {code:"M-P1-ALG-01", score:87},
              {code:"M-P1-PAT-03", score:88},
              {code:"M-P1-FIN-03", score:86},
            ].map(l=>(
              <div key={l.code} style={{background:"#0f111e", border:"1px solid #252a44", borderRadius:"12px", padding:"12px", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700, fontSize:"13px"}}>{l.code} {l.score >=80 ? "✅" : ""} {l.score}</div>
                  <div style={{fontSize:"11px", color:"#64748b"}}>M/S/A/CA ✅ | $0.0475</div>
                </div>
                <div style={{display:"flex", gap:"6px"}}>
                  <button style={{background:"#252a44", border:"none", color:"#94a3b8", padding:"6px 10px", borderRadius:"8px", fontSize:"11px"}}>View Nodes</button>
                  <button style={{background:"#22c55e", border:"none", color:"#000", padding:"6px 10px", borderRadius:"8px", fontSize:"11px", fontWeight:700}}>Approve</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
