"use client";
import { useState } from "react";

const NODES: any = [
  {
    id:"A", label:"Exam Hook", sub:"Exam Hook",
    content: {
      type:"hook",
      intro:"Imagine you're saving money. You start with R10 (that's your 'a'), and each day you add another R5. The pattern 10; 15; 20; 25; ... is an arithmetic sequence. First term a=10, common difference d=5.",
      terms:[
        {t:"Arithmetic Sequence", d:"Difference between consecutive terms is constant."},
        {t:"Common Difference (d)", d:"d = T₂ - T₁"},
        {t:"General Term (Tₙ)", d:"Tₙ = a + (n-1)d"},
        {t:"Sum (Sₙ)", d:"Sₙ = n/2 [2a + (n-1)d]"}
      ]
    }
  },
  {
    id:"B", label:"Learn The Concept", sub:"Learn The Concept",
    content: {
      type:"worked",
      questions:[
        {q:"Given: 7; 12; 17; ... Determine 91st term.", marks:"3 marks", steps:[
          {n:"a = 7", d:"First term", f:""},
          {n:"d = 12-7 = 5", d:"Common difference", f:""},
          {n:"T₉₁ = 7 + (91-1)(5) = 457", d:"Substitute", f:"457 is the 91st term"}
        ]},
        {q:"Which term = 517?", marks:"4 marks", steps:[
          {n:"517 = 7 + (n-1)5", d:"Set Tₙ = 517", f:""},
          {n:"n = 103", d:"Solve", f:"517 is 103rd term"}
        ]}
      ]
    }
  },
  {
    id:"C", label:"Worked Example", sub:"Worked Example",
    content: { type:"error", errors:[
      {title:"Using Tₙ when Sₙ is required", comment:"Confused term with sum. No marks.", lost:"3", fix:"'Sum' = Sₙ, 'Term' = Tₙ"},
      {title:"Missing brackets", comment:"Wrote a + n-1 x d", lost:"2", fix:"Always (n-1)*d"},
    ]}
  },
  {
    id:"D", label:"Examiner Traps", sub:"Examiner Traps",
    content: { type:"strategy", tips:[
      {title:"Determine Tₙ", attack:"Find a,d → Tₙ = a+(n-1)d", ex:"Find general term of 3;7;11"},
      {title:"Which term = 200?", attack:"Set Tₙ=200, solve n", ex:"Which term is 200?"},
    ]}
  },
  {
    id:"E", label:"Exam Challenge", sub:"Exam Challenge",
    content: { type:"formula", formulas:[
      {f:"Tₙ = a + (n-1)d", when:"Find term or position"},
      {f:"Sₙ = n/2[2a+(n-1)d]", when:"Sum of first n terms"},
    ]}
  }
];

export default function TopicPage(){
  const [open, setOpen] = useState("A");
  return(
    <div style={{background:"#0e0f1a", minHeight:"100vh", color:"#e5e7eb", paddingBottom:110}}>
      <div style={{margin:12, background:"#000", borderRadius:18, border:"1px solid #252a44"}}>
        <div style={{height:190, display:"flex", alignItems:"center", justifyContent:"center"}}>▶ Video Placeholder</div>
      </div>

      <div style={{padding:"0 12px", display:"flex", flexDirection:"column", gap:12}}>
        {NODES.map((node:any)=>{
          const isOpen = open===node.id;
          const c = node.content as any;
          return(
            <div key={node.id} style={{background:"#1a1c2e", border:`1px solid ${isOpen?"#7b7eff":"#252a44"}`, borderRadius:20, padding:14}}>
              <div onClick={()=> setOpen(isOpen?"":node.id)} style={{display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer"}}>
                <div style={{display:"flex", alignItems:"center", gap:12}}>
                  <div style={{width:38,height:38,borderRadius:19,background:isOpen?"#7b7eff":"#252a5a", color:isOpen?"#000":"#8b8bff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800}}>{node.id}</div>
                  <div><div style={{fontSize:12, color:"#9aa0b6"}}>Node {node.id} · {node.label}</div><div style={{fontWeight:800}}>{node.sub}</div></div>
                </div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <div style={{width:22,height:22,borderRadius:11,border:"1px solid #22c55e", color:"#22c55e", display:"flex", alignItems:"center", justifyContent:"center"}}>✓</div>
                  <div style={{background:"#252a44", padding:"6px 10px", borderRadius:14, fontSize:11, color:"#8b8bff"}}>⚡ Quick Edit</div>
                </div>
              </div>

              {isOpen && (
                <div style={{marginTop:16, borderTop:"1px solid #252a44", paddingTop:16}}>
                  {c.type==="hook" && (
                    <div>
                      <p style={{fontSize:14, lineHeight:1.6, color:"#cbd5e1"}}>{c.intro}</p>
                      {c.terms?.map((t:any)=><div key={t.t} style={{marginTop:10, background:"#12131f", padding:10, borderRadius:12, fontSize:13}}><b>{t.t}</b><br/><span style={{color:"#9aa0b6"}}>{t.d}</span></div>)}
                    </div>
                  )}
                  {c.type==="worked" && c.questions?.map((q:any,i:number)=>(
                    <div key={i} style={{marginBottom:14, background:"#12131f", borderRadius:14, padding:12, border:"1px solid #252a44"}}>
                      <div style={{fontWeight:700}}>{q.q}</div>
                      {q.steps?.map((s:any,j:number)=>(
                        <div key={j} style={{display:"flex", gap:10, marginTop:10}}>
                          <div style={{width:24,height:24,borderRadius:12,background:"#252a5a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#8b8bff"}}>{j+1}</div>
                          <div><div style={{fontWeight:700, fontSize:13, whiteSpace:"pre-line"}}>{s.n}</div><div style={{fontSize:12,color:"#9aa0b6"}}>{s.d}</div>{s.f&&<div style={{marginTop:6, background:"#0f2a1e", borderLeft:"3px solid #22c55e", padding:6, borderRadius:8, fontSize:12}}>{s.f}</div>}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {c.type==="error" && c.errors?.map((e:any,i:number)=>(
                    <div key={i} style={{marginBottom:10, background:"#2a1a1e", borderLeft:"4px solid #ef4444", borderRadius:12, padding:12}}>
                      <div style={{fontSize:10, color:"#ef4444", fontWeight:800}}>COMMON ERROR</div><div style={{fontWeight:700, fontSize:13, marginTop:4}}>{e.title}</div><div style={{fontSize:12, marginTop:4}}>{e.fix}</div>
                    </div>
                  ))}
                  {c.type==="strategy" && c.tips?.map((t:any,i:number)=>(
                    <div key={i} style={{marginBottom:10, background:"#12131f", borderLeft:"4px solid #7b7eff", borderRadius:12, padding:12}}>
                      <div style={{fontSize:10, color:"#7b7eff", fontWeight:800}}>EXAMINER TIP</div><div style={{fontWeight:700, marginTop:4}}>{t.title}</div><div style={{fontSize:12, color:"#9aa0b6", marginTop:4}}>{t.attack}</div>
                    </div>
                  ))}
                  {c.type==="formula" && c.formulas?.map((f:any,i:number)=>(
                    <div key={i} style={{background:"#12131f", border:"1px solid #252a44", borderRadius:14, padding:16, textAlign:"center", marginBottom:10}}>
                      <div style={{fontSize:20, fontFamily:"serif"}}>{f.f}</div><div style={{fontSize:11, color:"#8a8a9a", marginTop:6}}>{f.when}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
