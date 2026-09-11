"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function MathBatch(){
  const [topics,setTopics]=useState<any[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [loading,setLoading]=useState(false);

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("topic_knowledge").select("id, topic, subject").ilike("subject","%math%").limit(100);
    setTopics(data||[]);
  })()},[]);

  const toggle=(id:string)=> setSelected(s=> s.includes(id)? s.filter(x=>x!==id) : [...s,id]);
  const cost = selected.length * 0.04; // $0.04 per topic est

  return (
    <div style={{background:"#1c1c24", padding:16, borderRadius:20}}>
      <h2 style={{margin:0}}>Math Topic Regeneration - Matric 360</h2>
      <div style={{display:"flex", gap:8, marginTop:8, fontSize:12, color:"#9ca3af", background:"#0f0f14", padding:"8px 12px", borderRadius:10, width:"fit-content"}}>
        <span>TOPICS {selected.length}</span><span>|</span><span>EST COST ${cost.toFixed(2)}</span>
      </div>
      <div style={{marginTop:16, maxHeight:300, overflow:"auto"}}>
        {topics.map(t=><div key={t.id} onClick={()=>toggle(t.id)} style={{padding:10, borderBottom:"1px solid #222", background: selected.includes(t.id)? "#2a2a3a":"transparent", cursor:"pointer"}}>{t.topic}</div>)}
      </div>
      <button disabled={loading || !selected.length} style={{marginTop:16, background:"#8b7cf8", color:"black", fontWeight:"800", padding:"10px 20px", borderRadius:12, border:"none", width:"100%"}}>
        {loading? "Generating...": `Generate ${selected.length} Topics`}
      </button>
      <p style={{fontSize:11, color:"#666", marginTop:8}}>This will call /api/batch-generate (we'll create next)</p>
    </div>
  )
}
