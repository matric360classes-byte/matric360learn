"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function MathBatchPage(){
  const router = useRouter();
  const [topics,setTopics]=useState<any[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [subject,setSubject]=useState("Mathematics");
  const [limit,setLimit]=useState(10);
  const [provider,setProvider]=useState("Matric360 AI Gateway");
  const [model,setModel]=useState("google/gemini-2.5-pro");
  const [cap,setCap]=useState(2.00);
  const [running,setRunning]=useState(false);
  const [logs,setLogs]=useState<string[]>([]);

  useEffect(()=>{(async()=>{
    const { data } = await supabase.from("topic_knowledge").select("id, subject, topic, title").ilike("subject", `%${subject==="Mathematics"?"math":"physical"}%`).limit(200);
    setTopics(data||[]);
  })()},[subject]);

  const estCost = selected.length * 0.0475;
  const perTopic = 0.0475;

  const runBatch = async()=>{
    setRunning(true); setLogs([`Starting batch ${selected.length} topics...`]);
    for(let i=0;i<selected.length;i++){
      const tid = selected[i];
      setLogs(l=>[...l, `→ Generating ${i+1}/${selected.length} : ${tid} (delay 10s, concurrency 1)`]);
      try{
        // Call your AI gateway - staging only!
        const res = await fetch("/api/factory/batch-generate",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ topic_id: tid, provider, model, subject })
        });
        const j = await res.json();
        setLogs(l=>[...l, `✓ Staging saved: quality ${j.quality_score||'--'} cost $${j.cost||'0.0475'}`]);

        await supabase.from("lesson_previews").upsert({
          topic_id: tid,
          subject,
          node_a: j.node_a,
          node_b: j.node_b,
          node_c: j.node_c,
          node_d: j.node_d,
          node_e: j.node_e,
          quality_score: j.quality_score||75,
          status: j.quality_score>=80?"ready_for_publish":"in_review",
          cost: perTopic,
          model
        });
      }catch(e:any){ setLogs(l=>[...l, `✗ Failed ${tid}: ${e.message}`]); }
      await new Promise(r=>setTimeout(r,10000)); // 10s delay like old dev
      if(estCost > cap){ setLogs(l=>[...l, `HARD CAP $${cap} hit - stopping`]); break; }
    }
    setRunning(false); setLogs(l=>[...l, `DONE - check Publishing Queue`]);
  };

  return (
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui", padding:12}}>
      <button onClick={()=>router.push("/admin")} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:12, padding:"8px 16px", marginBottom:12}}>← Factory</button>
      <h1 style={{fontSize:20, fontWeight:"800"}}>Math Batch Regeneration</h1>
      <p style={{color:"#9ca3af", fontSize:12}}>Regenerate Nodes A-E for every Grade 12 topic. Stored in staging only - no production lessons change.</p>

      <div style={{background:"#1c1c24", borderRadius:16, padding:12, marginTop:12, border:"1px solid #8b7cf8"}}>
        <div style={{display:"flex", justifyContent:"space-between", fontSize:12, fontWeight:"bold"}}><span>COST GUARD: TOPICS {selected.length}</span><span>EST COST ${estCost.toFixed(4)}</span><span>PER TOPIC ${perTopic}</span><span>HARD CAP ${cap.toFixed(2)}</span></div>
        <div style={{height:8, background:"#222", borderRadius:10, marginTop:8}}><div style={{width:`${Math.min(100,(estCost/cap)*100)}%`, height:8, background: estCost>cap?"#ef4444":"#22c55e", borderRadius:10}}></div></div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:12}}>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{background:"#1c1c24", color:"white", padding:10, borderRadius:12, border:"1px solid #333"}}><option>Mathematics</option><option>Physical Sciences</option></select>
        <select value={provider} onChange={e=>setProvider(e.target.value)} style={{background:"#1c1c24", color:"white", padding:10, borderRadius:12, border:"1px solid #333"}}><option>Matric360 AI Gateway</option></select>
        <select value={model} onChange={e=>setModel(e.target.value)} style={{background:"#1c1c24", color:"white", padding:10, borderRadius:12, border:"1px solid #333"}}><option>google/gemini-2.5-pro</option><option>google/gemini-2.5-flash</option></select>
        <input type="number" value={limit} onChange={e=>setLimit(parseInt(e.target.value))} style={{background:"#1c1c24", color:"white", padding:10, borderRadius:12, border:"1px solid #333"}} placeholder="Limit 10"/>
      </div>

      <div style={{marginTop:12, background:"#1c1c24", borderRadius:16, padding:12, maxHeight:300, overflow:"auto"}}>
        <div style={{display:"flex", justifyContent:"space-between", marginBottom:8}}><b>Select Topics ({topics.length})</b><button onClick={()=>setSelected(topics.slice(0,limit).map((t:any)=>t.id))} style={{background:"#8b7cf8", border:"none", padding:"4px 10px", borderRadius:10, fontSize:11}}>Select first {limit}</button></div>
        {topics.map((t:any)=><div key={t.id} style={{display:"flex", gap:8, padding:6, borderBottom:"1px solid #222"}}><input type="checkbox" checked={selected.includes(t.id)} onChange={e=>{if(e.target.checked)setSelected([...selected,t.id]); else setSelected(selected.filter(s=>s!==t.id))}}/><span style={{fontSize:12}}>{t.topic||t.title}</span></div>)}
      </div>

      <button disabled={running||selected.length===0} onClick={runBatch} style={{width:"100%", marginTop:12, background: running?"#333":"#8b7cf8", color: running?"#999":"black", fontWeight:"800", padding:14, borderRadius:16, border:"none"}}>{running?"GENERATING... (1 concurrency, 10s delay)":"GENERATE BATCH → STAGING (lesson_previews)"}</button>

      <div style={{marginTop:12, background:"black", borderRadius:12, padding:10, fontSize:11, fontFamily:"monospace", maxHeight:200, overflow:"auto"}}>{logs.map((l,i)=><div key={i}>{l}</div>)}</div>

      <div style={{marginTop:12, display:"flex", gap:8}}>
        <button onClick={()=>router.push("/admin/publish")} style={{flex:1, background:"#162216", border:"1px solid #22c55e", color:"#22c55e", padding:10, borderRadius:12}}>Go to Publishing Queue (score ≥80)</button>
        <button onClick={()=>router.push("/admin/review")} style={{flex:1, background:"#1c1c24", border:"none", color:"white", padding:10, borderRadius:12}}>Review Staging</button>
      </div>
    </div>
  );
}
