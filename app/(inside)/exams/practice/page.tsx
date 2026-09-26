"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PracticeEngine(){
  const router = useRouter();
  const [subjects,setSubjects]=useState<string[]>([]);
  const [units,setUnits]=useState<string[]>([]);
  const [topics,setTopics]=useState<string[]>([]);

  const [subject,setSubject]=useState("");
  const [unit,setUnit]=useState("All units");
  const [topic,setTopic]=useState("All topics");
  const [difficulty,setDifficulty]=useState("Medium");
  const [count,setCount]=useState(10);

  useEffect(()=>{
    async function loadMeta(){
      const {data} = await supabase.from("questions").select("subject,unit,topic").limit(2000);
      if(data){
        setSubjects([...new Set(data.map(d=>d.subject).filter(Boolean))]);
        setUnits(["All units",...new Set(data.map(d=>d.unit).filter(Boolean)) as any]);
        setTopics(["All topics",...new Set(data.map(d=>d.topic).filter(Boolean)) as any]);
      }
    }
    loadMeta();
  },[]);

  // Filter units/topics when subject changes
  useEffect(()=>{
    async function filterBySubject(){
      if(!subject) return;
      const {data} = await supabase.from("questions").select("unit,topic").eq("subject",subject).limit(2000);
      if(data){
        setUnits(["All units",...new Set(data.map(d=>d.unit).filter(Boolean)) as any]);
        setTopics(["All topics",...new Set(data.map(d=>d.topic).filter(Boolean)) as any]);
      }
    }
    if(subject) filterBySubject();
  },[subject]);

  function startSession(){
    localStorage.setItem("matric360_practice", JSON.stringify({subject,unit,topic,difficulty,count}));
    router.push(`/exams/practice/session?subject=${subject}&unit=${unit}&topic=${topic}&difficulty=${difficulty}&count=${count}`);
  }

  return(
    <div style={{padding:"12px 12px 90px", background:"#0a0a12", minHeight:"100vh", color:"white"}}>
      <div onClick={()=>router.push("/exams")} style={{fontSize:14,color:"#9ca3af",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>← Back to Exams</div>
      <div style={{fontSize:26,fontWeight:900,marginTop:12}}>Practice Engine</div>
      <div style={{fontSize:13,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>Build a session from the live question bank. Pick a scope, difficulty, and question count.</div>

      <div style={{marginTop:18, display:"flex", flexDirection:"column", gap:14}}>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,letterSpacing:1,color:"#9ca3af",display:"flex",alignItems:"center",gap:6}}>📖 SUBJECT</div>
          <select value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            <option value="">Choose subject...</option>
            {subjects.map(s=><option key={s} value={s}>{s}</option>)}
            <option value="Mathematics">Mathematics</option>
            <option value="Physical Sciences">Physical Sciences</option>
          </select>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,letterSpacing:1,color:"#9ca3af"}}>📚 UNIT (OPTIONAL)</div>
          <select value={unit} onChange={e=>setUnit(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {units.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,letterSpacing:1,color:"#9ca3af"}}>🎯 TOPIC (OPTIONAL)</div>
          <select value={topic} onChange={e=>setTopic(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {topics.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{fontSize:10,color:"#6b7280",marginTop:6}}>NO TERM grouping: Subject {'>'} Unit {'>'} Topic ✅</div>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,letterSpacing:1,color:"#9ca3af"}}>DIFFICULTY</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            {["Easy","Medium","Hard","Exam Style"].map(d=>(
              <button key={d} onClick={()=>setDifficulty(d)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:difficulty===d?"#2a2a5a":"#0f0f14",color:difficulty===d?"#818cf8":"white",fontWeight:difficulty===d?700:400}}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,letterSpacing:1,color:"#9ca3af"}}># QUESTION COUNT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginTop:10}}>
            {[5,10,20,50].map(n=>(
              <button key={n} onClick={()=>setCount(n)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:count===n?"#2a2a5a":"#0f0f14",color:count===n?"#818cf8":"white",fontWeight:count===n?700:400}}>{n}</button>
            ))}
          </div>
        </div>

        <button onClick={startSession} disabled={!subject} style={{marginTop:6,background: subject? "linear-gradient(135deg,#8fa8ff,#b9a6ff)" : "#222",color: subject? "#1e1b4b" : "#666",padding:16,borderRadius:14,fontWeight:900,fontSize:15,border:"none"}}>
          Start Session → {count} Questions {subject?`• ${subject}`:""}
        </button>
        <div style={{fontSize:11,color:"#6b7280",textAlign:"center"}}>{subjects.length>0? `${subjects.length} subjects • Live from question bank` : "Loading live question bank..."}</div>
      </div>
    </div>
  )
}
