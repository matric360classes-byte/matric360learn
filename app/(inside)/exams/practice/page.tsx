"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PracticeEngine(){
  const router = useRouter();
  const [questions,setQuestions]=useState<any[]>([]);
  const [subject,setSubject]=useState("Physical Sciences");
  const [unit,setUnit]=useState("All units");
  const [topic,setTopic]=useState("All topics");
  const [difficulty,setDifficulty]=useState("Exam Style");
  const [count,setCount]=useState(10);
  const [units,setUnits]=useState<string[]>(["All units"]);
  const [topics,setTopics]=useState<string[]>(["All topics"]);

  // Load ALL your 2100+ questions once
  useEffect(()=>{
    async function load(){
      const {data} = await supabase.from("questions").select("*").limit(2500);
      if(data) {
        setQuestions(data);
        const subj = subject || "Physical Sciences";
        updateFilters(data, subj);
      }
    }
    load();
  },[]);

  // When subject changes, rebuild units/topics from topic_path
  useEffect(()=>{
    if(questions.length>0) updateFilters(questions, subject);
  },[subject]);

  function updateFilters(data:any[], subj:string){
    const filtered = data.filter(q=>q.subject===subj);
    // Extract units from topic_path or unit field - NO TERM
    const unitSet = new Set<string>();
    const topicSet = new Set<string>();
    filtered.forEach(q=>{
      if(q.unit) unitSet.add(q.unit);
      if(q.topic) topicSet.add(q.topic);
      if(q.topic_path){
        const parts = q.topic_path.split(" > ");
        if(parts[1]) unitSet.add(parts[1]); // Unit is second part
        if(parts[2]) topicSet.add(parts[2]); // Topic is third part
      }
    });
    setUnits(["All units",...Array.from(unitSet)]);
    setTopics(["All topics",...Array.from(topicSet)]);
    if(unitSet.size===0) setUnits(["All units","Mechanics","Waves","Electricity","Matter","Chemical Change","Algebra","Calculus","Trigonometry"]);
    if(topicSet.size===0) setTopics(["All topics","Vectors","Energy","Functions","First Principles"]);
  }

  function startSession(){
    const config = {subject,unit,topic,difficulty,count};
    localStorage.setItem("matric360_practice", JSON.stringify(config));
    router.push(`/exams/practice/session?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}&topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&count=${count}`);
  }

  return(
    <div style={{padding:"12px 12px 90px", background:"#0a0a12", minHeight:"100vh", color:"white"}}>
      <div onClick={()=>router.push("/exams")} style={{fontSize:14,color:"#9ca3af",cursor:"pointer"}}>← Back to Exams</div>
      <div style={{fontSize:26,fontWeight:900,marginTop:12}}>Practice Engine</div>
      <div style={{fontSize:13,color:"#9ca3af",marginTop:6}}>Build a session from the live question bank. Pick a scope, difficulty, and question count.</div>

      <div style={{marginTop:18, display:"flex", flexDirection:"column", gap:14}}>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>SUBJECT</div>
          <select value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            <option>Physical Sciences</option>
            <option>Mathematics</option>
            <option>All Subjects</option>
          </select>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>UNIT (OPTIONAL) - {units.length-1} units found</div>
          <select value={unit} onChange={e=>setUnit(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {units.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>TOPIC (OPTIONAL) - {topics.length-1} topics found</div>
          <select value={topic} onChange={e=>setTopic(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {topics.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{fontSize:10,color:"#22c55e",marginTop:8}}>NO TERM grouping: Subject &gt; Unit &gt; Topic ✅ {questions.length} questions loaded</div>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>DIFFICULTY</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            {["Easy","Medium","Hard","Exam Style"].map(d=>(
              <button key={d} onClick={()=>setDifficulty(d)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:difficulty===d?"#4f46e5":"#0f0f14",color:"white"}}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}># QUESTION COUNT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginTop:10}}>
            {[5,10,20,50].map(n=>(
              <button key={n} onClick={()=>setCount(n)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:count===n?"#4f46e5":"#0f0f14",color:"white"}}>{n}</button>
            ))}
          </div>
        </div>

        <button onClick={startSession} style={{marginTop:6,background:"white",color:"black",padding:16,borderRadius:14,fontWeight:900,fontSize:15,border:"none"}}>
          Start Session → {count} Questions • {subject}
        </button>
      </div>
    </div>
  )
}
