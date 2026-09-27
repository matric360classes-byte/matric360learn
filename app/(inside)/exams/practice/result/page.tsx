"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage(){
  const router = useRouter();
  const [data,setData]=useState<any>(null);

  useEffect(()=>{
    const raw = localStorage.getItem("matric360_last_session");
    if(raw){
      setData(JSON.parse(raw));
    }
  },[]);

  if(!data) return (
    <div style={{padding:20, background:"#0a0a12", minHeight:"100vh", color:"white"}}>
      <div>Loading results...</div>
      <div style={{marginTop:12, fontSize:13, color:"#9ca3af"}}>If this stays blank, go back and finish a session.</div>
      <button onClick={()=>router.push("/exams/practice")} style={{marginTop:16, background:"white", color:"black", padding:12, borderRadius:999, fontWeight:800, border:"none"}}>Back to Practice</button>
    </div>
  );

  const { qs, scores, subject } = data;
  const total = scores.reduce((a:number,b:any)=>a+b.marks,0);
  const max = qs.reduce((a:number,b:any)=>a+(b.marks||0),0);
  const percent = max>0? Math.round((total/max)*100):0;
  const correctCount = scores.filter((s:any)=>s.correct).length;

  // Group weak topics from DB - no hardcoding
  const weakMap:any = {};
  scores.forEach((s:any)=>{
    if(!s.correct){
      const key = s.question.topic || s.question.unit || "General";
      weakMap[key] = (weakMap[key]||0)+1;
    }
  });

  function getOptions(q:any){
    try{ const o = typeof q.options==="string"? JSON.parse(q.options): q.options; return Array.isArray(o)? o:[] }catch{return []}
  }
  function getCorrectText(q:any){
    const opts = getOptions(q);
    const ca = (q.correct_answer??"").toString().trim();
    if(!ca) return q.explanation?.slice(0,150)||"";
    if(/^[0-3]$/.test(ca) && opts[Number(ca)]) return opts[Number(ca)];
    if(/^[1-4]$/.test(ca) && opts[Number(ca)-1]) return opts[Number(ca)-1];
    if(/^[A-D]$/i.test(ca) && opts[ca.toUpperCase().charCodeAt(0)-65]) return opts[ca.toUpperCase().charCodeAt(0)-65];
    return ca;
  }

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", padding:"12px 12px 90px"}}>
      <div onClick={()=>router.push("/exams/practice")} style={{fontSize:14, color:"#9ca3af", cursor:"pointer"}}>← Back to Practice</div>

      <div style={{marginTop:16, background:"#15151f", borderRadius:20, padding:20, border:"1px solid #222", textAlign:"center"}}>
        <div style={{fontSize:11, color:"#9ca3af"}}>SESSION COMPLETE • {subject}</div>
        <div style={{fontSize:36, fontWeight:900, marginTop:8, color: percent>=50? "#22c55e":"#f59e0b"}}>{percent}%</div>
        <div style={{fontSize:14, marginTop:4}}>{total} / {max} marks • {correctCount}/{qs.length} correct</div>
        <div style={{display:"flex", gap:10, marginTop:16}}>
          <button onClick={()=>router.push("/exams/practice")} style={{flex:1, background:"white", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none"}}>New Session</button>
          <button onClick={()=>router.push("/exams")} style={{flex:1, background:"#222", color:"white", padding:14, borderRadius:999, fontWeight:800, border:"none"}}>Exams Home</button>
        </div>
      </div>

      {Object.keys(weakMap).length>0 && (
        <div style={{marginTop:16, background:"#1a1a2e", borderRadius:16, padding:16, border:"1px solid #2a2a3a"}}>
          <div style={{fontSize:12, fontWeight:800, color:"#f59e0b"}}>RECOMMENDED FOCUS</div>
          <div style={{marginTop:8, display:"flex", flexWrap:"wrap", gap:8}}>
            {Object.entries(weakMap).map(([k,v]:any)=><span key={k} style={{fontSize:12, background:"#0f0f14", border:"1px solid #2a2a3a", padding:"6px 10px", borderRadius:999}}>{k} • {v} wrong</span>)}
          </div>
        </div>
      )}

      <div style={{marginTop:16, fontSize:13, fontWeight:800, color:"#9ca3af"}}>REVIEW - {qs.length} QUESTIONS</div>
      <div style={{marginTop:10, display:"flex", flexDirection:"column", gap:12}}>
        {qs.map((q:any,i:number)=>{
          const sc = scores.find((s:any)=>s.qId===q.id);
          return(
            <div key={q.id} style={{background:"#15151f", borderRadius:16, padding:14, border:`1px solid ${sc?.correct? "#14532d": sc?.marks>0? "#854d0e":"#450a0a"}`}}>
              <div style={{display:"flex", justifyContent:"space-between", fontSize:11, color:"#9ca3af"}}>
                <span>Q{i+1} • {q.marks}M • {q.difficulty_l}</span>
                <span style={{color: sc?.correct? "#22c55e": sc?.marks>0? "#f59e0b":"#ef4444", fontWeight:800}}>{sc?.correct? `✓ ${sc.marks}/${q.marks}`: sc?.marks>0? `~ ${sc.marks}/${q.marks}`: `✗ 0/${q.marks}`}</span>
              </div>
              <div style={{marginTop:6, fontSize:14}}>{q.question_text}</div>
              <div style={{marginTop:8, fontSize:12, background:"#0a0a12", padding:10, borderRadius:10, border:"1px solid #1f2937"}}>
                <div><span style={{color:"#9ca3af"}}>Your answer:</span> {sc?.userAnswer || <i style={{color:"#666"}}>No answer</i>}</div>
                <div style={{marginTop:6}}><span style={{color:"#9ca3af"}}>Correct:</span> <b style={{color:"white"}}>{sc?.correctText || getCorrectText(q)}</b></div>
                {q.explanation && <div style={{marginTop:6, color:"#d1d5db", whiteSpace:"pre-wrap"}}><span style={{color:"#9ca3af"}}>Memo:</span> {q.explanation}</div>}
                {sc?.reason && <div style={{marginTop:6, fontSize:11, color:"#9ca3af"}}>Auto-mark: {sc.reason}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
