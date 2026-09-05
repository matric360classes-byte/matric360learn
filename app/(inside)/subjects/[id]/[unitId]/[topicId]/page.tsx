"use client";
import { useState } from "react";

const NODES = [
  {
    id:"A", label:"Exam Hook", sub:"Exam Hook",
    content: {
      type:"hook",
      intro:"Imagine you're saving money. You start with R10 (that's your 'a'), and each day you add another R5. The pattern of your savings is 10; 15; 20; 25; ... This is an arithmetic sequence. The 'first term' (a) is 10, and the 'common difference' (d) is 5 because you're adding it every time. We have formulas to quickly find out how much you'll have on any given day (Tₙ) or the total amount you've saved after a certain number of days (Sₙ).",
      terms:[
        {t:"Arithmetic Sequence", d:"A sequence of numbers in which the difference between any two consecutive terms is constant. Also known as an arithmetic progression."},
        {t:"Common Difference (d)", d:"The constant value that is added to each term to get the next term. Calculated as d = T₂ - T₁."},
        {t:"General Term (Tₙ)", d:"A formula that allows you to calculate any term. For arithmetic: Tₙ = a + (n-1)d."},
        {t:"Sum (Sₙ)", d:"The sum of the first n terms of a sequence. Sₙ = n/2 [2a + (n-1)d]"}
      ]
    }
  },
  {
    id:"B", label:"Learn The Concept", sub:"Learn The Concept",
    content: {
      type:"worked",
      questions:[
        {q:"Given the arithmetic sequence: 7; 12; 17; ... Determine the 91st term.", marks:"3 marks", steps:[
          {n:"a = 7", d:"Identify first term"},
          {n:"d = 12 - 7 = 5", d:"Common difference"},
          {n:"Tₙ = a + (n-1)d\nT₉₁ = 7 + (91-1)(5)", d:"Substitute into formula"},
          {n:"T₉₁ = 7 + 450 = 457", d:"Calculate", final:"457 is the 91st term"}
        ]},
        {q:"For 7; 12; 17; ..., which term is equal to 517?", marks:"4 marks", steps:[
          {n:"a=7; d=5", d:"Identify a and d"},
          {n:"Tₙ = a+(n-1)d\n517 = 7 + (n-1)5", d:"Set Tₙ = 517"},
          {n:"510 = (n-1)5\n102 = n-1\nn=103", d:"Solve for n", final:"517 is the 103rd term"}
        ]},
        {q:"Find the general term of 3; 7; 11; ...", marks:"3 marks", steps:[
          {n:"a=3; d=4", d:"Find a and d"},
          {n:"Tₙ = 3 + (n-1)4\nTₙ = 4n -1", d:"Simplify", final:"Tₙ = 4n - 1"}
        ]}
      ]
    }
  },
  {
    id:"C", label:"Worked Example", sub:"Worked Example",
    content: {
      type:"error",
      errors:[
        {title:"Using Tₙ when Sₙ is required", comment:"Candidate confused term formula with sum formula. No marks awarded for incorrect formula selection.", lost:"3 marks", fix:"Read carefully: 'Sum' = Sₙ = n/2[2a+(n-1)d], 'Term' = Tₙ = a+(n-1)d."},
        {title:"Forgetting brackets: a + (n-1)d", comment:"Candidate wrote a + n-1 x d without brackets, gets wrong order of operations.", lost:"2 marks", fix:"Always write (n-1) in brackets then multiply by d."},
        {title:"Calculating d incorrectly: T₁ - T₂ instead of T₂ - T₁", comment:"Leads to negative d when it should be positive.", lost:"1 mark", fix:"d = T₂ - T₁ = second minus first."}
      ]
    }
  },
  {
    id:"D", label:"Examiner Traps", sub:"Examiner Traps",
    content: {
      type:"strategy",
      tips:[
        {title:"Determine Tₙ / Find the nth term", attack:"Find a and d, substitute into Tₙ = a+(n-1)d. Simplify but don't solve for n.", ex:"Determine general term of 3; 7; 11; ..."},
        {title:"Calculate T₅₀", attack:"Find a,d. Identify n=50. Substitute all three into Tₙ and calculate.", ex:"Calculate 50th term of 3; 7; 11; ..."},
        {title:"Which term equals 200?", attack:"Find a,d. Set Tₙ = 200. Solve for n. n must be positive integer.", ex:"Which term is 200 in 3; 7; 11; ...?"},
        {title:"Sum of first n terms", attack:"If you see word 'sum' — use Sₙ formula. Check if they give you Tₙ or Sₙ.", ex:"Find sum of first 20 terms"}
      ]
    }
  },
  {
    id:"E", label:"Exam Challenge", sub:"Exam Challenge",
    content: {
      type:"formula",
      formulas:[
        {f:"Tₙ = a + (n - 1)d", when:"Find term, find position (n), or find general formula."},
        {f:"Sₙ = n/2 [2a + (n-1)d]", when:"Calculate sum of first n terms when you know a,d,n."},
        {f:"Sₙ = n/2 (a + L)", when:"Sum when you know first term a and last term L."},
        {f:"d = T₂ - T₁", when:"Always to find common difference."}
      ]
    }
  }
];

export default function TopicPage(){
  const [open, setOpen] = useState("A");

  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#e5e7eb", paddingBottom:110}}>
      
      {/* VIDEO - like your screenshot */}
      <div style={{margin:12, background:"#000", borderRadius:18, overflow:"hidden", border:"1px solid #252a44"}}>
        <div style={{height:190, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(45deg,#1a1c2e,#000)"}}>
          <span style={{color:"#6b7280"}}>▶ Video Placeholder</span>
        </div>
        <div style={{padding:10, fontSize:11, color:"#6b7280", display:"flex", justifyContent:"space-between"}}>
          <span>Content is licensed to your Matric360 account. Sharing is prohibited.</span>
          <span>Watch on YouTube</span>
        </div>
      </div>

      {/* NODES VERTICAL - EXACTLY LIKE YOUR SCREENSHOT */}
      <div style={{padding:"0 12px", display:"flex", flexDirection:"column", gap:12}}>
        {NODES.map(node=>{
          const isOpen = open===node.id;
          return(
            <div key={node.id} style={{background:"#1a1c2e", border:`1px solid ${isOpen?"#7b7eff":"#252a44"}`, borderRadius:20, padding:14, transition:"0.2s"}}>
              {/* HEADER - CLICKABLE */}
              <div onClick={()=> setOpen(isOpen?"":node.id)} style={{display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer"}}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                  <div style={{width:38,height:38,borderRadius:19,background:isOpen?"#7b7eff":"#252a5a", color:isOpen?"#000":"#8b8bff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800}}>{node.id}</div>
                  <div>
                    <div style={{fontSize:12, color:"#9aa0b6"}}>Node {node.id} · {node.label}</div>
                    <div style={{fontWeight:800, fontSize:15}}>{node.sub}</div>
                  </div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <div style={{width:22,height:22,borderRadius:11,border:"1px solid #22c55e", color:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12}}>✓</div>
                  <div style={{background:"#252a44", padding:"6px 10px", borderRadius:14, fontSize:11, color:"#8b8bff"}}>⚡ Quick Edit</div>
                </div>
              </div>

              {/* CONTENT - SHOWS WHEN OPEN */}
              {isOpen && (
                <div style={{marginTop:16, borderTop:"1px solid #252a44", paddingTop:16}}>
                  
                  {node.content.type==="hook" && (
                    <div>
                      <p style={{fontSize:14, lineHeight:1.6, color:"#cbd5e1"}}>{node.content.intro}</p>
                      <div style={{marginTop:16, fontWeight:800, fontSize:13}}>Key terms</div>
                      {node.content.terms.map((t:any)=><div key={t.t} style={{marginTop:12, background:"#12131f", padding:10, borderRadius:12, fontSize:13}}><b style={{color:"#e5e7eb"}}>{t.t}</b><br/><span style={{color:"#9aa0b6"}}>{t.d}</span></div>)}
                    </div>
                  )}

                  {node.content.type==="worked" && node.content.questions.map((q:any,i:number)=>(
                    <div key={i} style={{marginBottom:18, background:"#12131f", borderRadius:14, padding:12, border:"1px solid #252a44"}}>
                      <div style={{fontSize:10, letterSpacing:1, color:"#6b7280"}}>QUESTION {i+1}</div>
                      <div style={{fontWeight:700, marginTop:4, fontSize:14}}>{q.q}</div>
                      <div style={{fontSize:11, color:"#6b7280"}}>({q.marks})</div>
                      {q.steps.map((s:any,j:number)=>(
                        <div key={j} style={{display:"flex", gap:10, marginTop:12}}>
                          <div style={{width:24,height:24,borderRadius:12,background:"#252a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#8b8bff",flexShrink:0}}>{j+1}</div>
                          <div><div style={{fontWeight:700, whiteSpace:"pre-line", fontSize:13}}>{s.n}</div><div style={{fontSize:12,color:"#9aa0b6"}}>{s.d}</div>{s.final&&<div style={{marginTop:6, background:"#0f2a1e", borderLeft:"3px solid #22c55e", padding:8, borderRadius:8, fontSize:12}}><b>FINAL: {s.final}</b></div>}</div>
                        </div>
                      ))}
                    </div>
                  ))}

                  {node.content.type==="error" && node.content.errors.map((e:any,i:number)=>(
                    <div key={i} style={{marginBottom:12, background:"#2a1a1e", borderLeft:"4px solid #ef4444", borderRadius:12, padding:12}}>
                      <div style={{fontSize:10, color:"#ef4444", fontWeight:800}}>COMMON ERROR {i+1}</div>
                      <div style={{marginTop:6, fontWeight:700, fontSize:13}}>{e.title}</div>
                      <div style={{marginTop:6, fontSize:12, lineHeight:1.5, color:"#cbd5e1"}}><b>Marker:</b> {e.comment}<br/><b>Lost:</b> {e.lost}<br/><b>Fix:</b> {e.fix}</div>
                    </div>
                  ))}

                  {node.content.type==="strategy" && node.content.tips.map((t:any,i:number)=>(
                    <div key={i} style={{marginBottom:12, background:"#12131f", borderLeft:"4px solid #7b7eff", borderRadius:12, padding:12}}>
                      <div style={{fontSize:10, color:"#7b7eff", fontWeight:800}}>EXAMINER TIP</div>
                      <div style={{fontWeight:700, marginTop:4, fontSize:13}}>{t.title}</div>
                      <div style={{fontSize:12, color:"#9aa0b6", marginTop:4, lineHeight:1.5}}><b>How to attack:</b> {t.attack}<br/><b>Example:</b> {t.ex}</div>
                    </div>
                  ))}

                  {node.content.type==="formula" && (
                    <div style={{display:"flex", flexDirection:"column", gap:12}}>
                      {node.content.formulas.map((f:any,i:number)=>(
                        <div key={i} style={{background:"#12131f", border:"1px solid #252a44", borderRadius:14, padding:16, textAlign:"center"}}>
                          <div style={{fontSize:20, fontFamily:"serif", fontWeight:700}}>{f.f}</div>
                          <div style={{fontSize:11, color:"#8a8a9a", marginTop:6}}>{f.when}</div>
                        </div>
                      ))}
                      <div style={{background:"#0f1f18", border:"1px solid #14532d", borderRadius:14, padding:14, textAlign:"center", marginTop:4}}>
                        <div style={{color:"#22c55e", fontWeight:800}}>🎉 Topic Complete</div>
                        <div style={{fontSize:12, color:"#8a8a9a", marginTop:4}}>Next: Geometric Sequences</div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
