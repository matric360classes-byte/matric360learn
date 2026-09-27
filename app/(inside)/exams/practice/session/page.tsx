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
  const [debug,setDebug]=useState("");

  useEffect(()=>{
    async function load(){
      const subject = params.get("subject") || "Physical Sciences";
      const unit = params.get("unit") || "All units";
      const topic = params.get("topic") || "All topics";
      const difficulty = params.get("difficulty") || "All";
      const count = Number(params.get("count")||10);

      // MAP Exam Style -> L5 etc
      const diffMap: any = {
        "Easy": ["L1","L2"],
        "Medium": ["L3"],
        "Hard": ["L4"],
        "Exam Style": ["L5", "L4"],
        "All": null
      };
      const levels = diffMap[difficulty];

      // USE ILIKE not EQ - fixes lowercase bug
      let query = supabase.from("questions").select("*").ilike("subject", `%${subject}%`).limit(1000);
      if(levels){
        query = query.in("difficulty_l", levels);
      }

      let {data, error} = await query;
      if(error){
        setDebug(`DB Error: ${error.message}`);
        setLoading(false);
        return;
      }

      let filtered = data || [];
      setDebug(`Found ${filtered.length} for subject=${subject} difficulty=${difficulty}`);

      // Filter unit/topic - CASE INSENSITIVE
      if(unit!=="All units" && unit!=="All Units" && unit){
        const u = unit.toLowerCase();
        filtered = filtered.filter(q=>
          q.unit?.toLowerCase()===u ||
          q.topic_path?.toLowerCase().includes(u) ||
          q.topic?.toLowerCase().includes(u)
        );
      }
      if(topic!=="All topics" && topic!=="All Topics" && topic){
        const t = topic.toLowerCase();
        filtered = filtered.filter(q=>
          q.topic?.toLowerCase()===t ||
          q.topic_path?.toLowerCase().includes(t)
        );
      }

      // If filters too strict, fallback to any from subject
      if(filtered.length===0 && data && data.length>0){
        filtered = data; // fallback
      }

      const shuffled = filtered.sort(()=>0.5-Math.random()).slice(0,count);
      setQs(shuffled);
      setLoading(false);
    }
    load();
  },[params]);

  if(loading) return <div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading {params.get("count")} random questions from live bank... {debug}</div>;
  if(qs.length===0) return (
    <div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>
      <div>No questions found.</div>
      <div style={{fontSize:12,color:"#9ca3af",marginTop:8}}>{debug}</div>
      <div style={{fontSize:12,color:"#6b7280",marginTop:8}}>Filters: subject={params.get("subject")} unit={params.get("unit")} topic={params.get("topic")} difficulty={params.get("difficulty")}</div>
      <div style={{marginTop:16, fontSize:12}}>Run this SQL to fix case:<br/>UPDATE questions SET subject = 'Physical Sciences' WHERE subject ILIKE '%physical%';<br/>UPDATE questions SET subject = 'Mathematics' WHERE subject ILIKE '%math%';</div>
      <button onClick={()=>router.push("/exams/practice")} style={{marginTop:16,padding:10,background:"white",color:"black",borderRadius:8}}>Back</button>
    </div>
  );

  const q = qs[idx];
  return(
    <div style={{padding:"16px 16px 90px",background:"#08080a",minHeight:"100vh",color:"white"}}>
      <div onClick={()=>router.push("/exams/practice")} style={{color:"#9ca3af",cursor:"pointer"}}>← Exit Session</div>
      <div style={{marginTop:12,display:"flex",justifyContent:"space-between", alignItems:"center"}}>
        <span style={{fontSize:12,background:"#222",padding:"6px 10px",borderRadius:999}}>Q {idx+1}/{qs.length}</span>
        <span style={{fontSize:11,color:"#818cf8", maxWidth:"60%", textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{q.topic_path || `${q.unit || ''} > ${q.topic || ''}`}</span>
      </div>
      <div style={{marginTop:16,background:"#15151f",border:"1px solid #222",padding:18,borderRadius:16}}>
        <div style={{fontSize:16,lineHeight:1.6}}>{q.question_text}</div>
        {q.options && (
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
            {(typeof q.options==="string"? (()=>{try{return JSON.parse(q.options)}catch{return []}})() : q.options).map((opt:string,i:number)=>(
              <div key={i} style={{background:"#0f0f14",border:"1px solid #2a2a3a",padding:12,borderRadius:10, cursor:"pointer"}}>{String.fromCharCode(65+i)}. {opt}</div>
            ))}
          </div>
        )}
        {q.explanation && <div style={{marginTop:12,fontSize:12,color:"#9ca3af",background:"#0f0f14",padding:10,borderRadius:8}}>💡 {q.explanation}</div>}
        <div style={{marginTop:12, fontSize:11, color:"#555"}}>{q.marks} marks • {q.difficulty_l} • {q.difficulty_label}</div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button disabled={idx===0} onClick={()=>setIdx(i=>i-1)} style={{flex:1,padding:14,borderRadius:12,background:"#222",color:"white",opacity:idx===0?0.3:1, border:"none"}}>Previous</button>
        <button onClick={()=> idx<qs.length-1? setIdx(i=>i+1) : router.push("/exams")} style={{flex:1,padding:14,borderRadius:12,background:"white",color:"black",fontWeight:800, border:"none"}}>{idx<qs.length-1?"Next →":"Finish"}</button>
      </div>
    </div>
  )
}

export default function SessionPage(){
  return(
    <Suspense fallback={<div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading session...</div>}>
      <SessionInner />
    </Suspense>
  )
}
