"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getOptions(q:any): string[] {
  try {
    const o = typeof q.options === "string"? JSON.parse(q.options) : q.options;
    return Array.isArray(o)? o : [];
  } catch { return []; }
}

// This fixes Correct: 1 -> actual text
function getCorrectText(q:any): string {
  const opts = getOptions(q);
  const ca = (q.correct_answer?? "").toString().trim();
  if (!ca) return q.explanation?.split("\n")[0] || ""; // LONG uses memo

  // If ca is 0,1,2,3 -> index
  if (/^[0-3]$/.test(ca) && opts[Number(ca)]) return opts[Number(ca)];
  // If ca is 1,2,3,4 (1-based from your generator)
  if (/^[1-4]$/.test(ca) && opts[Number(ca)-1]) return opts[Number(ca)-1];
  // If ca is A,B,C,D
  if (/^[A-D]$/i.test(ca) && opts[ca.toUpperCase().charCodeAt(0)-65]) return opts[ca.toUpperCase().charCodeAt(0)-65];
  // If ca is full text
  return ca;
}

function SessionInner(){
  const router = useRouter();
  const params = useSearchParams();
  const [qs,setQs]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<string|null>(null);
  const [textAns,setTextAns]=useState("");
  const [submitted,setSubmitted]=useState(false);
  const [scores,setScores]=useState<any[]>([]);

  useEffect(()=>{
    async function load(){
      const subject = params.get("subject")||"";
      const unit = params.get("unit")||"All units";
      const topic = params.get("topic")||"All topics";
      const difficulty = params.get("difficulty")||"All";
      const count = Number(params.get("count")||10);
      const {data} = await supabase.from("questions").select("*").limit(2500);
      let f = data||[];
      if(subject) f = f.filter((q:any)=>(q.subject||"").toLowerCase()===subject.toLowerCase());
      if(!unit.includes("All")) f = f.filter((q:any)=>(q.unit||"").includes(unit) || (q.topic_path||"").includes(unit));
      if(!topic.includes("All")) f = f.filter((q:any)=>(q.topic||"").includes(topic) || (q.topic_path||"").includes(topic));
      if(difficulty!=="All") f = f.filter((q:any)=>q.difficulty_l===difficulty || q.difficulty_label===difficulty);
      setQs(f.sort(()=>0.5-Math.random()).slice(0,count)); setLoading(false);
    }
    load();
  },[params]);

  function handleMcqSubmit(){
    const q = qs[idx];
    const correctText = getCorrectText(q);
    const isCorrect = (selected||"").trim().toLowerCase() === correctText.trim().toLowerCase();
    const newEntry = { qId: q.id, question: q, userAnswer: selected, correctText, correct: isCorrect, marks: isCorrect? q.marks:0, total: q.marks };
    setScores([...scores.filter(s=>s.qId!==q.id), newEntry]);
    setSubmitted(true);
  }

  function handleLongSelfMark(correct:boolean){
    const q = qs[idx];
    const correctText = getCorrectText(q);
    const newEntry = { qId: q.id, question: q, userAnswer: textAns, correctText, correct, marks: correct? q.marks:0, total: q.marks };
    setScores([...scores.filter(s=>s.qId!==q.id), newEntry]);
    setSubmitted(true); // actually already submitted, this is final self-mark
    // move to next automatically after self-mark? keep for review
  }

  function next(){
    if(idx<qs.length-1){ setIdx(idx+1); setSelected(null); setTextAns(""); setSubmitted(false); }
    else {
      localStorage.setItem("matric360_last_session", JSON.stringify({qs, scores, subject: params.get("subject"), date: new Date().toISOString()}));
      router.push("/exams/practice/result");
    }
  }

  if(loading) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>Loading...</div>;
  const q = qs[idx]; if(!q) return null;
  const opts = getOptions(q);
  const isLong = opts.length===0;
  const totalScore = scores.reduce((a,b)=>a+b.marks,0);
  const totalMax = qs.reduce((a,b)=>a+(b.marks||0),0);
  const currentScore = scores.find(s=>s.qId===q.id);

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", paddingBottom:80}}>
      <div style={{padding:"12px 16px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid #1a1a2e"}}>
        <span style={{fontSize:14, color:"#9ca3af"}}>Question {idx+1} / {qs.length}</span>
        <span style={{fontSize:14, color:"#9ca3af"}}>Score: {totalScore} / {totalMax}</span>
      </div>
      <div style={{height:4, background:"#1a1a2e"}}><div style={{height:4, background:"#818cf8", width:`${((idx)/qs.length)*100}%`, transition:"0.3s"}} /></div>

      <div style={{padding:16}}>
        <div style={{background:"#15151f", borderRadius:20, padding:16, border:"1px solid #222"}}>
          <div style={{fontSize:11, color:"#9ca3af"}}>{q.question_type|| (isLong?"LONG_QUESTION":"MCQ")} · {q.marks} MARKS · {q.difficulty_l}</div>
          <div style={{marginTop:8, fontSize:16}}>{q.question_text}</div>

          {!submitted? (
            isLong? (
              <>
                <textarea value={textAns} onChange={e=>setTextAns(e.target.value)} placeholder="Write your full answer here..." style={{marginTop:16, width:"100%", minHeight:120, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14, color:"white"}}/>
                <button onClick={()=>setSubmitted(true)} disabled={!textAns.trim()} style={{width:"100%", marginTop:12, background:"#818cf8", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity: textAns.trim()?1:0.5}}>View memo & self-mark</button>
                <div style={{fontSize:11, color:"#9ca3af", marginTop:8}}>Long-form answers are flagged for self-review against the memo — not auto-marked.</div>
              </>
            ) : (
              <>
                <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
                  {opts.map((o,i)=><div key={i} onClick={()=>setSelected(o)} style={{padding:"14px 16px", borderRadius:999, border:"1px solid", borderColor:selected===o?"#818cf8":"#2a2a3a", background:selected===o?"#1e1b4b":"#0f0f14", cursor:"pointer"}}>{o}</div>)}
                </div>
                <button onClick={handleMcqSubmit} disabled={!selected} style={{width:"100%", marginTop:16, background:"#818cf8", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity:selected?1:0.5}}>Submit answer</button>
              </>
            )
          ) : (
            <>
              {isLong && <div style={{marginTop:16, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14}}>{textAns}</div>}
              <div style={{marginTop:16, padding:14, borderRadius:16, border:"1px solid", borderColor: currentScore?.correct? "#22c55e":"#ef4444", background: currentScore?.correct? "#052e16":"#450a0a"}}>
                {!isLong? (
                  <>
                    <div style={{fontWeight:800}}>{currentScore?.correct? "✓ Correct":"✗ Incorrect"} · {currentScore?.marks}/{q.marks}</div>
                    <div style={{fontSize:13, marginTop:6}}>Answer: {getCorrectText(q)}</div>
                    <div style={{fontSize:13, marginTop:8, color:"#d1d5db"}}>{q.explanation}</div>
                  </>
                ) : (
                  <>
                    <div style={{fontWeight:800}}>Memo:</div>
                    <div style={{fontSize:13, marginTop:6, whiteSpace:"pre-wrap"}}>{q.explanation || getCorrectText(q)}</div>
                    <div style={{display:"flex", gap:10, marginTop:12}}>
                      <button onClick={()=>handleLongSelfMark(true)} style={{flex:1, background:"#22c55e", color:"black", padding:10, borderRadius:999, fontWeight:800, border:"none"}}>I got it right ✓</button>
                      <button onClick={()=>handleLongSelfMark(false)} style={{flex:1, background:"#ef4444", color:"white", padding:10, borderRadius:999, fontWeight:800, border:"none"}}>I got it wrong ✗</button>
                    </div>
                  </>
                )}
              </div>
              {(!isLong || currentScore) && <button onClick={next} style={{width:"100%", marginTop:16, background:"#818cf8", padding:14, borderRadius:999, fontWeight:800, border:"none"}}>{idx<qs.length-1?"Next question →":"Finish → View Results"}</button>}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default function SessionPage(){ return <Suspense fallback={<div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading...</div>}><SessionInner/></Suspense> }
