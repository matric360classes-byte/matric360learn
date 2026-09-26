"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function SessionPage(){
  const router = useRouter();
  const params = useSearchParams();
  const [qs,setQs]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function load(){
      const subject = params.get("subject") || "Physical Sciences";
      const unit = params.get("unit") || "All units";
      const topic = params.get("topic") || "All topics";
      const count = Number(params.get("count")||10);

      let query = supabase.from("questions").select("*").eq("subject", subject).limit(500);
      const {data} = await query;
      let filtered = data || [];

      if(unit!=="All units") filtered = filtered.filter(q=> q.unit===unit || q.topic_path?.includes(unit));
      if(topic!=="All topics") filtered = filtered.filter(q=> q.topic===topic || q.topic_path?.includes(topic));

      // Shuffle for different set every time
      const shuffled = filtered.sort(()=>0.5-Math.random()).slice(0,count);
      setQs(shuffled);
      setLoading(false);
    }
    load();
  },[params]);

  if(loading) return <div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>Loading your {params.get("count")} random questions...</div>;
  if(qs.length===0) return <div style={{padding:20,background:"black",color:"white",minHeight:"100vh"}}>No questions found for {params.get("unit")} / {params.get("topic")}. Try All units. <button onClick={()=>router.back()}>Back</button></div>;

  const q = qs[idx];

  return(
    <div style={{padding:"16px 16px 90px",background:"#08080a",minHeight:"100vh",color:"white"}}>
      <div onClick={()=>router.push("/exams/practice")} style={{color:"#9ca3af",cursor:"pointer"}}>← Exit Session</div>
      <div style={{marginTop:12,display:"flex",justifyContent:"space-between"}}>
        <span style={{fontSize:12,background:"#222",padding:"6px 10px",borderRadius:999}}>Question {idx+1} / {qs.length}</span>
        <span style={{fontSize:12,color:"#818cf8"}}>{q.subject} • {q.topic_path || q.unit}</span>
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
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <button disabled={idx===0} onClick={()=>setIdx(i=>i-1)} style={{flex:1,padding:14,borderRadius:12,background:"#222",color:"white",opacity:idx===0?0.3:1}}>Previous</button>
        <button onClick={()=> idx<qs.length-1? setIdx(i=>i+1) : router.push("/exams")} style={{flex:1,padding:14,borderRadius:12,background:"white",color:"black",fontWeight:800}}>{idx<qs.length-1?"Next →":"Finish"}</button>
      </div>
    </div>
  )
}
