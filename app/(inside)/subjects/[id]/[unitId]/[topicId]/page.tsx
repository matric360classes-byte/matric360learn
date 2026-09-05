"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

const NODES = [
  { id:"A", label:"Exam Hook" },
  { id:"B", label:"Learn The Concept" },
  { id:"C", label:"Worked Example" },
  { id:"D", label:"Examiner Traps" },
  { id:"E", label:"Exam Strategy" },
];

export default function TopicPage(){
  const params = useParams() as any;
  const [active, setActive] = useState("A");

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#fff", paddingBottom:100}}>
      {/* VIDEO PLACEHOLDER - KEEPING YOURS */}
      <div style={{margin:12, background:"#000", borderRadius:16, height:190, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid #252a44"}}>
        <span style={{color:"#6b7280"}}>▶ Video Placeholder — {active}</span>
      </div>

      {/* NODES - NOW CLICKABLE + WIRED */}
      <div style={{display:"flex", gap:8, padding:"0 12px", overflowX:"auto"}}>
        {NODES.map(n=>{
          const isActive = n.id === active;
          return(
            <button key={n.id} onClick={()=> setActive(n.id)}
              style={{
                whiteSpace:"nowrap",
                padding:"8px 14px",
                borderRadius:20,
                border:`1px solid ${isActive?"#7b7eff":"#2a2d4a"}`,
                background:isActive?"#252a5a":"#1a1c2e",
                color:isActive?"#8b8bff":"#9aa0b6",
                fontSize:12, fontWeight:700
              }}>
              Node {n.id}: {n.label}
            </button>
          )
        })}
      </div>

      {/* CONTENT AREA - CHANGES WHEN YOU CLICK NODE */}
      <div style={{margin:12, background:"#1a1c2e", border:"1px solid #252a44", borderRadius:20, padding:16, minHeight:200}}>
        
        {active==="A" && (
          <div>
            <div style={{fontSize:11, letterSpacing:1, color:"#6b7280"}}>NODE A · EXAM HOOK · ~3 min</div>
            <h2 style={{fontSize:20, fontWeight:800, marginTop:6}}>Exam Hook - Real Life</h2>
            <p style={{marginTop:12, fontSize:14, lineHeight:1.6, color:"#cbd5e1"}}>
              Imagine you're saving money. You start with R10 (that's your 'a'), and each day you add another R5. 
              The pattern 10; 15; 20; 25; ... is an arithmetic sequence. First term a=10, common difference d=5.
            </p>
            <div style={{marginTop:16, fontWeight:800}}>Key terms</div>
            <div style={{marginTop:8, fontSize:13, color:"#9aa0b6"}}><b>Arithmetic Sequence</b> — difference between consecutive terms is constant.</div>
            <div style={{marginTop:8, fontSize:13, color:"#9aa0b6"}}><b>Common Difference (d)</b> — d = T₂ - T₁</div>
            <div style={{marginTop:8, fontSize:13, color:"#9aa0b6"}}><b>General Term (Tₙ)</b> — Tₙ = a + (n-1)d</div>
          </div>
        )}

        {active==="B" && (
          <div>
            <div style={{fontSize:11, color:"#6b7280"}}>NODE B · LEARN THE CONCEPT · ~8 min</div>
            <h2 style={{fontSize:18, fontWeight:800, marginTop:6}}>Worked Example: 7; 12; 17; ... 91st term</h2>
            <div style={{marginTop:12, display:"flex", gap:10}}><div style={{width:24,height:24,borderRadius:12,background:"#252a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#8b8bff"}}>1</div><div><b>a = 7</b><br/><span style={{fontSize:12,color:"#9aa0b6"}}>Identify first term.</span></div></div>
            <div style={{marginTop:12, display:"flex", gap:10}}><div style={{width:24,height:24,borderRadius:12,background:"#252a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#8b7eff"}}>2</div><div><b>d = 12-7 = 5</b><br/><span style={{fontSize:12,color:"#9aa0b6"}}>Common difference.</span></div></div>
            <div style={{marginTop:12, display:"flex", gap:10}}><div style={{width:24,height:24,borderRadius:12,background:"#252a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#8b7eff"}}>3</div><div><b>T₉₁ = 7 + (91-1)(5) = 457</b><br/><span style={{fontSize:12,color:"#9aa0b6"}}>Substitute into formula.</span></div></div>
            <div style={{marginTop:16, background:"#0f2a1e", borderLeft:"3px solid #22c55e", padding:10, borderRadius:8}}><div style={{fontSize:10}}>FINAL ANSWER</div><b>457 is the 91st term.</b></div>
          </div>
        )}

        {active==="C" && (
          <div style={{background:"#2a1a1e", borderLeft:"4px solid #ef4444", padding:14, borderRadius:12}}>
            <div style={{fontSize:10, color:"#ef4444", fontWeight:800}}>COMMON ERROR</div>
            <div style={{marginTop:8, fontSize:13, lineHeight:1.5}}>
              Using Tₙ when Sₙ is required.<br/><br/>
              <b>Marker comment:</b> Confused formula for term with sum formula. No marks.<br/>
              <b>Fix:</b> 'Sum' → use Sₙ = n/2[2a+(n-1)d]. 'Term' → use Tₙ = a+(n-1)d.
            </div>
          </div>
        )}

        {active==="D" && (
          <div style={{background:"#1a1c2e", borderLeft:"4px solid #7b7eff", padding:14, borderRadius:12}}>
            <div style={{fontSize:10, color:"#7b7eff", fontWeight:800}}>EXAMINER TIP</div>
            <div style={{marginTop:8, fontWeight:700}}>Determine Tₙ</div>
            <div style={{fontSize:12, color:"#9aa0b6", marginTop:4}}>Find 'a' and 'd', substitute into Tₙ = a+(n-1)d. Don't solve for n.</div>
          </div>
        )}

        {active==="E" && (
          <div style={{textAlign:"center"}}>
            <div style={{background:"#1a1c2e", border:"1px solid #252a44", borderRadius:16, padding:20}}>
              <div style={{fontSize:20, fontFamily:"serif"}}>Tₙ = a + (n-1)d</div>
              <div style={{fontSize:11, color:"#8a8a9a", marginTop:8}}>Find term, position, or general formula</div>
            </div>
            <div style={{marginTop:12, background:"#1a1c2e", border:"1px solid #252a44", borderRadius:16, padding:20}}>
              <div style={{fontSize:20, fontFamily:"serif"}}>Sₙ = n/2[2a+(n-1)d]</div>
              <div style={{fontSize:11, color:"#8a8a9a", marginTop:8}}>Sum of first n terms</div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
