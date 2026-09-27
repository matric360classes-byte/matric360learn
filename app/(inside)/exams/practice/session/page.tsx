"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
      let filtered = data||[];
      if(subject) filtered = filtered.filter((q:any)=>(q.subject||"").toLowerCase()===subject.toLowerCase());
      if(!unit.includes("All")) filtered = filtered.filter((q:any)=>(q.unit||"").includes(unit) || (q.topic_path||"").includes(unit));
      if(!topic.includes("All")) filtered = filtered.filter((q:any)=>(q.topic||"").includes(topic) || (q.topic_path||"").includes(topic));
      if(difficulty!=="All") filtered = filtered.filter((q:any)=>q.difficulty_l===difficulty || q.difficulty_label===difficulty);
      filtered = filtered.sort(()=>0.5-Math.random()).slice(0,count);
      setQs(filtered); setLoading(false);
    }
    load();
  },[params]);

  function getOptions(q:any){ try{ const o = typeof q.options==="string"? JSON.parse(q.options): q.options; return Array.isArray(o)? o:[] }catch{return[]} }

  function submit(){
    const q = qs[idx];
    const opts = getOptions(q);
    let correct=false;
    const ca = (q.correct_answer||"").toString().trim().toLowerCase();
    if(opts.length>0){
      // MCQ: correct can be "B" or full text
      if(ca.length<=2){ const ci = ca.toUpperCase().charCodeAt(0)-65; correct = opts.indexOf(selected||"")===ci || (selected||"").toLowerCase()===opts[ci]?.toLowerCase(); }
      else correct = (selected||"").toLowerCase()===ca;
    } else {
      // LONG: contains check, no hardcoding
      correct = textAns.toLowerCase().includes(ca.substring(0, Math.min(8, ca.length))) || textAns.toLowerCase()===ca;
    }
    setScores([...scores.filter((s:any)=>s.qId!==q.id), {qId:q.id, correct, marks: correct? q.marks:0, total: q.marks}]);
    setSubmitted(true);
  }

  if(loading) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>Loading...</div>;
  if(qs.length===0) return <div style={{padding:20, background:"#0a0a12", color:"white", minHeight:"100vh"}}>No questions <button onClick={()=>router.push("/exams/practice")}>Back</button></div>;

  const q = qs[idx];
  const opts = getOptions(q);
  const totalScore = scores.reduce((a,b)=>a+b.marks,0);
  const totalMax = qs.slice(0, idx+1).reduce((a,b)=>a+(b.marks||0),0) + qs.slice(idx+1).reduce((a,b)=>a+(b.marks||0),0);
  const currentScoreObj = scores.find((s:any)=>s.qId===q.id);

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", paddingBottom:80}}>
      {/* Header like screenshot */}
      <div style={{padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #1a1a2e"}}>
        <div style={{fontSize:14, color:"#9ca3af"}}>Question {idx+1} / {qs.length}</div>
        <div style={{fontSize:14, color:"#9ca3af"}}>Score: {totalScore} / {qs.reduce((a,b)=>a+(b.marks||0),0)}</div>
      </div>
      <div style={{height:4, background:"#1a1a2e"}}><div style={{height:4, background:"#818cf8", width:`${((idx+1)/qs.length)*100}%`}} /></div>

      <div style={{padding:16}}>
        <div style={{background:"#15151f", borderRadius:20, padding:16, border:"1px solid #222"}}>
          <div style={{fontSize:11, color:"#9ca3af"}}>{(q.question_type||"QUESTION").toUpperCase()} · {q.marks} MARKS · DIFFICULTY {q.difficulty_l||q.difficulty_label}</div>
          <div style={{marginTop:8, fontSize:16, lineHeight:1.5}}>{q.question_text}</div>

          {!submitted? (
            <>
              {opts.length>0? (
                <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
                  {opts.map((o:string,i:number)=>(
                    <div key={i} onClick={()=>setSelected(o)} style={{padding:"14px 16px", borderRadius:999, border:"1px solid", borderColor:selected===o?"#818cf8":"#2a2a3a", background:selected===o?"#1e1b4b":"#0f0f14", cursor:"pointer"}}>{o}</div>
                  ))}
                </div>
              ):(
                <div style={{marginTop:16}}>
                  <textarea value={textAns} onChange={e=>setTextAns(e.target.value)} placeholder="Write your full answer here..." style={{width:"100%", minHeight:120, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14, color:"white"}}/>
                  <div style={{fontSize:11, color:"#9ca3af", marginTop:8}}>Long-form answers are flagged for self-review against the memo — not auto-marked.</div>
                </div>
              )}
              <button onClick={submit} disabled={opts.length>0?!selected:!textAns.trim()} style={{width:"100%", marginTop:16, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none", opacity: (opts.length>0?!selected:!textAns.trim())?0.5:1}}>Submit answer</button>
            </>
          ):(
            <>
              {opts.length===0 && (
                <div style={{marginTop:16, background:"#0a0a12", border:"1px solid #2a2a3a", borderRadius:16, padding:14}}>{textAns}</div>
              )}
              <div style={{marginTop:16, padding:14, borderRadius:16, border:"1px solid", borderColor: currentScoreObj?.correct? "#22c55e":"#ef4444", background: currentScoreObj?.correct? "#052e16":"#450a0a"}}>
                <div style={{fontWeight:800, display:"flex", gap:8}}><span>{currentScoreObj?.correct?"✓":"✗"}</span><span>{currentScoreObj?.correct?`Correct · ${q.marks}/${q.marks}`:`Incorrect · 0/${q.marks}`}</span></div>
                <div style={{fontSize:13, marginTop:6, color:"#d1d5db"}}>{q.explanation||`Answer: ${q.correct_answer}`}</div>
              </div>
              <button onClick={()=>{ if(idx<qs.length-1){ setIdx(idx+1); setSelected(null); setTextAns(""); setSubmitted(false); } else router.push("/exams/practice"); }} style={{width:"100%", marginTop:16, background:"#818cf8", color:"black", padding:14, borderRadius:999, fontWeight:800, border:"none"}}>{idx<qs.length-1?"Next question →":"Finish"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
export default function SessionPage(){ return <Suspense fallback={<div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading...</div>}><SessionInner/></Suspense> }
