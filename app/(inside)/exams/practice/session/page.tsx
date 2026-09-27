"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getOptions(q:any): string[] {
  try {
    const o = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
    return Array.isArray(o) ? o : [];
  } catch { return []; }
}

function getCorrectText(q:any): string {
  const opts = getOptions(q);
  const ca = (q.correct_answer ?? "").toString().trim();
  if (!ca) return "";
  if (/^[0-3]$/.test(ca) && opts[Number(ca)]) return opts[Number(ca)];
  if (/^[1-4]$/.test(ca) && opts[Number(ca)-1]) return opts[Number(ca)-1];
  if (/^[A-D]$/i.test(ca) && opts[ca.toUpperCase().charCodeAt(0)-65]) return opts[ca.toUpperCase().charCodeAt(0)-65];
  return ca;
}

function normalize(s:string){
  return s.toLowerCase()
   .replace(/\s+/g,"")
   .replace(/\\[\(\)]/g,"")
   .replace(/[*×]/g,"*")
   .trim();
}

function autoMarkLong(userAns:string, q:any){
  const ca = (q.correct_answer||"").toString();
  const memo = (q.explanation||"").toString();
  const fullCorrect = (ca + " " + memo).toLowerCase();
  const userNorm = normalize(userAns);
  const correctNorm = normalize(ca);
  if(!userNorm) return { correct:false, marks:0, reason:"No answer" };
  if(userNorm === correctNorm) return { correct:true, marks:q.marks, reason:"Exact match" };

  const numRegex = /-?\d+(\.\d+)?/g;
  const correctNums = (ca.match(numRegex)||[]).map((n:string)=>normalize(n));
  const userNums = (userAns.match(numRegex)||[]).map((n:string)=>normalize(n));

  if(correctNums.length>0){
    // FIXED: typed n:string
    let matched = correctNums.filter((n:string)=> userNums.includes(n) || userNorm.includes(n)).length;
    if(matched>0){
      const ratio = matched / correctNums.length;
      if(ratio===1) return { correct:true, marks:q.marks, reason:`All values: ${correctNums.join(", ")}` };
      if(ratio>=0.5) return { correct:false, marks: Math.max(1, Math.round(ratio*q.marks)), reason:`Partial - found ${matched}/${correctNums.length}` };
    }
  }

  const keywords = fullCorrect.split(/[^a-z0-9]+/).filter((w:string)=>w.length>3);
  const keyMatched = keywords.filter((k:string)=> userAns.toLowerCase().includes(k)).length;
  if(keywords.length>0 && keyMatched / keywords.length >= 0.6){
    return { correct:true, marks:q.marks, reason:"Key terms matched" };
  }

  if(userNorm.length>=3 && (correctNorm.includes(userNorm) || fullCorrect.replace(/\s+/g,"").includes(userNorm))){
    return { correct:true, marks:q.marks, reason:"Contains answer" };
  }

  return { correct:false, marks:0, reason:`Expected: ${ca || memo.slice(0,80)}` };
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
      setQs(f.sort(()=>0.5-Math.random()).slice(0,count));
      setLoading(false);
    }
    load();
  },[params]);

  function handleSubmit(){
    const q = qs[idx];
    const opts = getOptions(q);
    let result:any;
    if(opts.length>0){
      const correctText = getCorrectText(q);
      const isCorrect = (selected||"").trim().toLowerCase() === correctText.trim().toLowerCase();
      result = { correct:isCorrect, marks: isCorrect? q.marks:0, correctText, reason: isCorrect? "Correct option":"Wrong option" };
    } else {
      const auto = autoMarkLong(textAns, q);
      result = { correct:auto.correct, marks:auto.marks, correctText: getCorrectText(q) || q.explanation, reason:auto.reason };
    }
    const newEntry = {
      qId: q.id, question: q, userAnswer: opts.length>0? selected:textAns,
      correctText: result.correctText, correct: result.correct, marks: result.marks, total: q.marks, reason: result.reason
    };
    setScores(prev=> [...prev.filter((s:any)=>s.qId!==q.id), newEntry]);
    setSubmitted(true);
  }

  function next(){
    if(idx<qs.length-1){
      setIdx(idx+1); setSelected(null); setTextAns(""); setSubmitted(false);
    } else {
      const total = scores.reduce((a:number,b:any)=>a+b.marks,0);
      const max = qs.reduce((a:number,b:any)=>a+(b.marks||0),0);
      localStorage.setItem("matric360_last_session", JSON.stringify({
        qs, scores, subject: params.get("subject"), date: new Date().toISOString(), total, max
      }));
      router.push("/exams/practice/result");
    }
  }

  if(loading) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>Loading...</div>;
  if(qs.length===0) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>No questions found <button onClick={()=>router.push("/exams/practice")}>Back</button></div>;

  const q = qs[idx];
  if(!q) return null;
  const opts = getOptions(q);
  const isLong = opts.length===0;
  const totalScore = scores.reduce((a:number,b:any)=>a+b.marks,0);
  const totalMax = qs.reduce((a:number,b:any)=>a+(b.marks||0),0);
  const currentScore = scores.find((s:any)=>s.qId===q.id);

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", paddingBottom:80}}>
      <div style={{padding:"12px 16px", display:"flex", justifyContent:"space-between", borderBottom:"1px solid #1a1a2e"}}>
        <span style={{fontSize:14, color:"#9ca3af"}}>Question {idx+1} / {qs.length}</span>
        <span style={{fontSize:14, color:"#9ca3af"}}>Score: {totalScore} / {totalMax}</span>
      </div>
      <div style={{height:4, background:"#1a1a2e"}}><div style={{height:4, background:"#818cf8", width:`${((idx)/qs.length)*100}%`, transition:"0.3s"}} /></div>

      <div style={{padding:16}}>
        <div style={{background:"#15151f", borderRadius:20, padding:16, border:"1px solid #222"}}>
          <div style={{fontSize:11, color:"#9ca3af"}}>{(q.question_type|| (isLong?"LONG_QUESTION":"MCQ")).toUpperCase()} · {q.marks} MARKS · {q.difficulty_l||q.difficulty_label} {q.topic_path? `· ${q.topic_path}`: ""}</div>
          <div style={{marginTop:8, fontSize:16, lineHeight:1.5}}>{q.question_text}</div>

          {!submitted? (
            isLong? (
              <>
                <textarea value={textAns} onChange={(e:any)=>setTextAns(e.target.value)} placeholder="Write your full answer here..." style={{marginTop:16, width:"100%", minHeight:120, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14, color:"white"}}/>
                <button onClick={handleSubmit} disabled={!textAns.trim()} style={{width:"100%", marginTop:12, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity: textAns.trim()?1:0.5}}>Submit answer</button>
                <div style={{fontSize:11, color:"#9ca3af", marginTop:8}}>Auto-marked by system • No self-marking</div>
              </>
            ) : (
              <>
                <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
                  {opts.map((o:string,i:number)=><div key={i} onClick={()=>setSelected(o)} style={{padding:"14px 16px", borderRadius:999, border:"1px solid", borderColor:selected===o?"#818cf8":"#2a2a3a", background:selected===o?"#1e1b4b":"#0f0f14", cursor:"pointer"}}>{o}</div>)}
                </div>
                <button onClick={handleSubmit} disabled={!selected} style={{width:"100%", marginTop:16, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity:selected?1:0.5}}>Submit answer</button>
              </>
            )
          ) : (
            <>
              {isLong && <div style={{marginTop:16, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14, color:"#d1d5db"}}><b>Your answer:</b> {textAns}</div>}
              <div style={{marginTop:16, padding:14, borderRadius:16, border:"1px solid", borderColor: currentScore?.correct? "#22c55e": (currentScore?.marks>0? "#f59e0b":"#ef4444"), background: currentScore?.correct? "#052e16": (currentScore?.marks>0? "#422006":"#450a0a")}}>
                <div style={{fontWeight:800, display:"flex", justifyContent:"space-between"}}>
                  <span>{currentScore?.correct? "✓ Correct": (currentScore?.marks>0? `~ Partial · ${currentScore?.marks}/${q.marks}`: `✗ Incorrect · 0/${q.marks}`)}</span>
                  <span style={{fontSize:11, opacity:0.8}}>{currentScore?.reason}</span>
                </div>
                <div style={{fontSize:13, marginTop:6}}><b>Answer:</b> {getCorrectText(q) || q.explanation?.slice(0,200)}</div>
                {q.explanation && <div style={{fontSize:13, marginTop:8, color:"#d1d5db", whiteSpace:"pre-wrap"}}><b>Memo:</b> {q.explanation}</div>}
              </div>
              <button onClick={next} style={{width:"100%", marginTop:16, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none"}}>{idx<qs.length-1?"Next question →":"Finish → View Results"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SessionPage(){
  return(
    <Suspense fallback={<div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading...</div>}>
      <SessionInner/>
    </Suspense>
  )
}
