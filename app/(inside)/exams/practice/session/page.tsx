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

  useEffect(()=>{
    async function load(){
      const subject = (params.get("subject") || "Mathematics").toLowerCase();
      const unit = (params.get("unit") || "All units").toLowerCase();
      const topic = (params.get("topic") || "All topics").toLowerCase();
      const difficulty = params.get("difficulty") || "Exam Style";
      const count = Number(params.get("count")||10);

      const diffMap: any = {
        "Easy": ["L1","L2"],
        "Medium": ["L3"],
        "Hard": ["L4"],
        "Exam Style": ["L5"], // L5 = 83 maths, 82 physics - you proved it!
        "All": null
      };
      const levels = diffMap[difficulty];

      // SAME AS PRACTICE PAGE - LOAD ALL 2500, FILTER LOCALLY - NO RLS BUG
      const { data } = await supabase.from("questions").select("*").limit(2500);
      let filtered = data || [];

      // Subject filter - case insensitive
      filtered = filtered.filter((q:any)=> (q.subject||"").toLowerCase().includes(subject.split(" ")[0]) );

      // Difficulty filter
      if(levels){
        filtered = filtered.filter((q:any)=> levels.includes(q.difficulty_l));
      }

      // Unit filter
      if(!unit.includes("all units")){
        filtered = filtered.filter((q:any)=>
          (q.unit||"").toLowerCase().includes(unit) ||
          (q.topic_path||"").toLowerCase().includes(unit)
        );
      }

      // Topic filter
      if(!topic.includes("all topics")){
        filtered = filtered.filter((q:any)=>
          (q.topic||"").toLowerCase().includes(topic) ||
          (q.topic_path||"").toLowerCase().includes(topic)
        );
      }

      // Shuffle + slice
      filtered = filtered.sort(()=>0.5-Math.random()).slice(0,count);
      setQs(filtered);
      setLoading(false);
    }
    load();
  },[params]);

  if(loading) return <div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading session...</div>;
  if(qs.length===0) return <div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>No questions found. <button onClick={()=>router.push("/exams/practice")}>Back</button></div>;

  const q = qs[idx];
  return(
    <div style={{padding:"16px 16px 90px",background:"#08080a",minHeight:"100vh",color:"white"}}>
      <div onClick={()=>router.push("/exams/practice")} style={{color:"#9ca3af",cursor:"pointer"}}>← Exit Session</div>
      <div style={{marginTop:12,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:12,background:"#222",padding:"6px 10px",borderRadius:999}}>Q {idx+1}/{qs.length} • {q.subject} • {q.difficulty_l}</span>
        <span style={{fontSize:11,color:"#818cf8"}}>{q.topic_path || `${q.unit} > ${q.topic}`}</span>
      </div>
      <div style={{marginTop:16,background:"#15151f",border:"1px solid #222",padding:18,borderRadius:16}}>
        <div style={{fontSize:16,lineHeight:1.6}}>{q.question_text}</div>
        {q.options && (
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
            {(typeof q.options==="string"?JSON.parse(q.options):q.options).map((opt:string,i:number)=>(
              <div key={i} style={{background:"#0f0f14",border:"1px solid #2a2a3a",padding:12,borderRadius:10}}>{String.fromCharCode(65+i)}. {opt}</div>
            ))}
          </div>
        )}
        {q.explanation && <div style={{marginTop:12,fontSize:12,color:"#9ca3af",background:"#0f0f14",padding:10,borderRadius:8}}>💡 {q.explanation}</div>}
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button disabled={idx===0} onClick={()=>setIdx(i=>i-1)} style={{flex:1,padding:14,borderRadius:12,background:"#222",color:"white",opacity:idx===0?0.3:1}}>Previous</button>
        <button onClick={()=> idx<qs.length-1? setIdx(i=>i+1) : router.push("/exams")} style={{flex:1,padding:14,borderRadius:12,background:"white",color:"black",fontWeight:800}}>{idx<qs.length-1?"Next →":"Finish"}</button>
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
