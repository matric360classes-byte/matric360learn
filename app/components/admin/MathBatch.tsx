"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

const ALLOWED = ["mathematics","pure maths","maths","physical sciences","physical science"];

export default function MathBatch(){
  const [topics,setTopics]=useState<any[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [loading,setLoading]=useState(false);
  const [logs,setLogs]=useState<string[]>([]);

  useEffect(()=>{(async()=>{
    setLogs(["Loading topics..."]);
    const {data, error} = await supabase.from("topic_knowledge").select("*").limit(500);
    if(error){ setLogs([`DB Error: ${error.message}`]); return; }
    const filtered = (data||[]).filter((t:any)=>{
      const s=(t.subject||"").toLowerCase();
      return ALLOWED.some(a=> s.includes(a));
    });
    setTopics(filtered);
    const sample = filtered[0]? Object.keys(filtered[0]).join(", ") : "none";
    setLogs([`Found ${filtered.length} topics`, `Columns: ${sample}`]);
  })()},[]);

  const getName=(t:any)=> t.topic || t.title || t.topic_name || t.name || t.lesson_title || "Untitled";
  
  const toggle=(id:string)=> setSelected(s=> s.includes(id)? s.filter(x=>x!==id) : [...s,id]);
  const cost = selected.length * 0.04;

  const runBatch = async () => {
    if(selected.length===0) return;
    if(!confirm(`Generate ${selected.length}? $${cost.toFixed(2)}`)) return;
    setLoading(true);
    setLogs(l=>[...l, `Starting ${selected.length}...`]);
    try{
      const res = await fetch("/api/batch-generate",{method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({topicIds:selected})});
      const json = await res.json();
      if(!res.ok) throw new Error(json.error);
      setLogs(l=>[...l, `Done: ${json.generated}`].concat(json.details||[]));
      setSelected([]);
    }catch(e:any){ setLogs(l=>[...l, `Error: ${e.message}`]); }
    finally{ setLoading(false); }
  };

  return (
    <div style={{background:"#1c1c24", padding:16, borderRadius:20}}>
      <h2 style={{margin:0}}>Math Topic Regeneration</h2>
      <div style={{display:"flex", gap:8, marginTop:8}}>
        <span style={{background:"#0f0f14", padding:"8px 12px", borderRadius:20, fontSize:12}}>TOPICS {topics.length} | SEL {selected.length}</span>
        <span style={{background:"#0f0f14", padding:"8px 12px", borderRadius:20, fontSize:12}}>EST ${cost.toFixed(2)}</span>
      </div>
      <div style={{marginTop:12, display:"flex", gap:8}}>
        <button onClick={()=>setSelected(topics.map(t=>t.id))} style={{background:"#222", color:"white", padding:"6px 12px", borderRadius:10, border:"none"}}>Select All</button>
        <button onClick={()=>setSelected([])} style={{background:"#222", color:"white", padding:"6px 12px", borderRadius:10, border:"none"}}>Clear</button>
      </div>
      <div style={{marginTop:12, maxHeight:340, overflow:"auto", border:"1px solid #222", borderRadius:12, background:"#0f0f14"}}>
        {topics.map(t=><div key={t.id} onClick={()=>toggle(t.id)} style={{padding:10, borderBottom:"1px solid #1e1e1e", background: selected.includes(t.id)? "#2a2a4a":"transparent", cursor:"pointer", display:"flex", justifyContent:"space-between"}}><span style={{fontSize:13}}>{getName(t)}</span><span>{selected.includes(t.id)? "✅":"⬜"}</span></div>)}
      </div>
      <button onClick={runBatch} disabled={loading || selected.length===0} style={{marginTop:12, background: loading?"#444":"#8b7cf8", color:"black", fontWeight:"800", padding:"12px", borderRadius:12, border:"none", width:"100%"}}>{loading? "Generating...": `Generate ${selected.length} Topics`}</button>
      <div style={{marginTop:10, background:"black", borderRadius:12, padding:10, fontSize:10, fontFamily:"monospace", maxHeight:120, overflow:"auto"}}>{logs.map((l,i)=><div key={i} style={{color: l.includes("Error")?"#ef4444":"#9ca3af"}}>{l}</div>)}</div>
    </div>
  )
}
