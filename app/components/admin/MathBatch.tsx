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
  const [logs,setLogs]=useState<string[]>([]);

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("topic_knowledge").select("id, topic, subject, status").ilike("subject","%math%").limit(200);
    setTopics(data||[]);
  })()},[]);

  const toggle=(id:string)=> setSelected(s=> s.includes(id)? s.filter(x=>x!==id) : [...s,id]);
  const cost = selected.length * 0.04;
  const overBudget = cost > 2;
  const bgCost = overBudget ? "#3a1f1f" : "#0f0f14";
  const colorCost = overBudget ? "#ef4444" : "#9ca3af";

  const runBatch = async () => {
    if(!selected.length) return;
    if(!confirm(`Generate ${selected.length} topics? Est cost $${cost.toFixed(2)}`)) return;
    setLoading(true);
    setLogs([`Starting batch: ${selected.length} topics...`]);
    try {
      const res = await fetch("/api/batch-generate", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ topicIds: selected })
      });
      const json = await res.json();
      if(!res.ok) throw new Error(json.error || "Failed");
      setLogs(l=>[...l, `Done: ${json.generated} generated, $${json.cost?.toFixed(2)} spent`].concat(json.details || []));
      setSelected([]);
    } catch(e:any){
      setLogs(l=>[...l, `Error: ${e.message}`]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{background:"#1c1c24", padding:16, borderRadius:20}}>
      <h2 style={{margin:0}}>Math Topic Regeneration - Matric 360</h2>
      <div style={{display:"flex", gap:12, marginTop:8}}>
        <span style={{background:"#0f0f14", padding:"8px 12px", borderRadius:20, fontSize:12}}>TOPICS {selected.length}</span>
        <span style={{background:bgCost, color:colorCost, padding:"8px 12px", borderRadius:20, fontSize:12}}>EST COST ${cost.toFixed(2)}</span>
      </div>
      {overBudget && <div style={{marginTop:8, color:"#fbbf24", fontSize:11}}>Cost guard: over $2 - will ask confirm</div>}
      
      <div style={{marginTop:12, display:"flex", gap:8}}>
        <button onClick={()=>setSelected(topics.map(t=>t.id))} style={{background:"#222", color:"white", padding:"6px 12px", borderRadius:10, border:"none", fontSize:12}}>Select All ({topics.length})</button>
        <button onClick={()=>setSelected([])} style={{background:"#222", color:"white", padding:"6px 12px", borderRadius:10, border:"none", fontSize:12}}>Clear</button>
      </div>

      <div style={{marginTop:16, maxHeight:320, overflow:"auto", border:"1px solid #222", borderRadius:12}}>
        {topics.map(t=><div key={t.id} onClick={()=>toggle(t.id)} style={{padding:10, borderBottom:"1px solid #1a1a1a", background: selected.includes(t.id)? "#2a2a4a":"transparent", cursor:"pointer", display:"flex", justifyContent:"space-between"}}><span>{t.topic}</span><span style={{fontSize:10, color:"#666"}}>{t.status}</span></div>)}
      </div>

      <button onClick={runBatch} disabled={loading || selected.length===0} style={{marginTop:16, background: loading?"#444":"#8b7cf8", color:"black", fontWeight:"800", padding:"12px 20px", borderRadius:12, border:"none", width:"100%", cursor:"pointer"}}>
        {loading? "Generating...": `Generate ${selected.length} Topics`}
      </button>

      <div style={{marginTop:12, background:"#0f0f14", borderRadius:12, padding:10, fontSize:11, fontFamily:"monospace", maxHeight:150, overflow:"auto"}}>
        {logs.map((l,i)=><div key={i}>{l}</div>)}
        {logs.length===0 && <span style={{color:"#555"}}>Logs will appear here...</span>}
      </div>
    </div>
  )
}
