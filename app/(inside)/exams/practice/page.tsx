"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function PracticeEngine(){
  const router = useRouter();
  const [questions,setQuestions]=useState<any[]>([]);
  const [subjects,setSubjects]=useState<string[]>([]);
  const [units,setUnits]=useState<string[]>([]);
  const [topics,setTopics]=useState<string[]>([]);
  const [difficulties,setDifficulties]=useState<string[]>([]);

  const [subject,setSubject]=useState("");
  const [unit,setUnit]=useState("All units");
  const [topic,setTopic]=useState("All topics");
  const [difficulty,setDifficulty]=useState("All");
  const [count,setCount]=useState(10);

  // Load ALL questions ONCE
  useEffect(()=>{
    async function load(){
      const { data } = await supabase.from("questions").select("*").limit(2500);
      if(!data) return;
      setQuestions(data);

      // NO HARDCODING - Build everything from DB
      const subs = [...new Set(data.map((q:any)=>q.subject).filter(Boolean))].sort();
      setSubjects(subs);
      if(subs.length>0 &&!subject) setSubject(subs[0]);

      const diffs = [...new Set(data.map((q:any)=>q.difficulty_l || q.difficulty_label).filter(Boolean))].sort();
      setDifficulties(["All",...diffs]);
    }
    load();
  },[]);

  // Rebuild Units/Topics when subject changes - from DB only
  useEffect(()=>{
    if(!subject || questions.length===0) return;
    const filtered = questions.filter((q:any)=> (q.subject||"").toLowerCase() === subject.toLowerCase());

    const unitSet = new Set<string>();
    const topicSet = new Set<string>();
    filtered.forEach((q:any)=>{
      if(q.unit) unitSet.add(q.unit);
      if(q.topic) topicSet.add(q.topic);
      // Also parse topic_path: "Subject > Unit > Topic"
      if(q.topic_path){
        const parts = q.topic_path.split(">").map((s:string)=>s.trim()).filter(Boolean);
        if(parts.length>=2) unitSet.add(parts[1]);
        if(parts.length>=3) topicSet.add(parts[2]);
      }
    });
    setUnits(["All units",...Array.from(unitSet).sort()]);
    setTopics(["All topics",...Array.from(topicSet).sort()]);
    setUnit("All units");
    setTopic("All topics");
  },[subject, questions]);

  function startSession(){
    router.push(`/exams/practice/session?subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}&topic=${encodeURIComponent(topic)}&difficulty=${encodeURIComponent(difficulty)}&count=${count}`);
  }

  const filteredCount = questions.filter((q:any)=>{
    if(subject && (q.subject||"").toLowerCase()!== subject.toLowerCase()) return false;
    if(unit!=="All units" &&!(q.unit?.includes(unit) || q.topic_path?.includes(unit))) return false;
    if(topic!=="All topics" &&!(q.topic?.includes(topic) || q.topic_path?.includes(topic))) return false;
    if(difficulty!=="All" && (q.difficulty_l!==difficulty && q.difficulty_label!==difficulty)) return false;
    return true;
  }).length;

  return(
    <div style={{padding:"12px 12px 90px", background:"#0a0a12", minHeight:"100vh", color:"white"}}>
      <div onClick={()=>router.push("/exams")} style={{fontSize:14,color:"#9ca3af",cursor:"pointer"}}>← Back to Exams</div>
      <div style={{fontSize:26,fontWeight:900,marginTop:12}}>Practice Engine</div>
      <div style={{fontSize:13,color:"#9ca3af",marginTop:6}}>Build a session from the live question bank. No hardcoding — all from DB.</div>

      <div style={{marginTop:18, display:"flex", flexDirection:"column", gap:14}}>
        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>SUBJECT - {subjects.length} found in DB</div>
          <select value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {subjects.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>UNIT (OPTIONAL) - {units.length-1} units for {subject}</div>
          <select value={unit} onChange={e=>setUnit(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {units.map(u=><option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>TOPIC (OPTIONAL) - {topics.length-1} topics for {subject}</div>
          <select value={topic} onChange={e=>setTopic(e.target.value)} style={{width:"100%",marginTop:10,background:"#0f0f14",border:"1px solid #2a2a3a",padding:14,borderRadius:12,color:"white"}}>
            {topics.map(t=><option key={t} value={t}>{t}</option>)}
          </select>
          <div style={{fontSize:10,color:"#22c55e",marginTop:8}}>{questions.length} total questions in DB • {filteredCount} match current filters ✅</div>
        </div>

        <div style={{background:"#15151f",borderRadius:18,padding:16,border:"1px solid #222"}}>
          <div style={{fontSize:11,color:"#9ca3af"}}>DIFFICULTY - {difficulties.length-1} levels from DB</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            {difficulties.map(d=>(
              <button key={d} onClick={()=>setDifficulty(d)} style={{padding:12,borderRadius:999,border:"1px solid #2a2a3a",background:difficulty===d?"#4f46e5":"#0f0f14",color:"white", fontSize:13}}>{d}</button>
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

        <button disabled={filteredCount===0} onClick={startSession} style={{marginTop:6,background:filteredCount===0?"#333":"white",color:filteredCount===0?"#777":"black",padding:16,borderRadius:14,fontWeight:900,fontSize:15,border:"none"}}>
          {filteredCount===0? `No questions for this filter` : `Start Session → ${Math.min(count,filteredCount)} Questions • ${subject}`}
        </button>
      </div>
    </div>
  )
}
