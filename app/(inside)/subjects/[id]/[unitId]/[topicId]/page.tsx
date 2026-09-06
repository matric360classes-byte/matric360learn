"use client";
import { useState } from "react";
import { buildNodesForTopic } from "@/lib/nodeFactory";

export default function Page({ params }: any) {
  const subjectId = params.id as string;
  const topicId = params.topicId as string;
  const lesson: any = buildNodesForTopic(topicId, subjectId);
  if (!lesson) return <div style={{padding:20}}>No lesson {topicId}</div>;

  const NODES: any[] = lesson.nodes;
  const [active, setActive] = useState(0);

  // Find master data that has formulas
  const master: any = NODES.find((n:any)=>(n.data||n.content)?.formulas)?.data
                   || NODES.find((n:any)=>n.data||n.content)?.data
                   || NODES[0]?.data || NODES[0]?.content || {};

  const get = (keys: string[]) => {
    for (let k of keys) { if (master[k] && Array.isArray(master[k]) && master[k].length>0) return master[k]; }
    for (let k of keys) { if (master[k]) return master[k]; }
    return [];
  };

  const formulas = get(["formulas","equations","keyFormulas"]);
  const worked = get(["worked","examples","workedExamples","solved"]);
  const errors = get(["errors","traps","commonErrors","misconceptions","mistakes"]);
  const tips = get(["tips","examTips","hints"]);
  const checklist = get(["checklist","challenge","examChallenge","questions","tasks","examQuestions"]);

  return (
    <div style={{padding:16, maxWidth:800, margin:"0 auto", color:"#111"}}>
      <h2 style={{fontSize:24, fontWeight:900, color:"#000"}}>{lesson.title || topicId}</h2>
      <p style={{fontSize:13, opacity:0.6}}>{subjectId} / {params.unitId} / {topicId}</p>

      <div style={{display:"flex", gap:8, overflowX:"auto", margin:"16px 0"}}>
        {NODES.map((n:any,i:number)=>(
          <button key={i} onClick={()=>setActive(i)} style={{padding:"10px 14px", borderRadius:999, border:"1px solid #999", background:i===active?"#000":"#fff", color:i===active?"#fff":"#000", fontWeight:700, whiteSpace:"nowrap"}}>
            {n.id}: {n.label}
          </button>
        ))}
      </div>

      <div style={{border:"1px solid #ddd", borderRadius:16, padding:16, background:"#fff", color:"#111", minHeight:200}}>
        {active===0 && (
          <div>
            <h3>📌 Exam Hook</h3>
            <p style={{lineHeight:1.6}}>{master.intro || master.hook || master.title || "High yield CAPS topic. Appears every year."}</p>
          </div>
        )}
        {active===1 && (
          <div>
            <h3>📚 Learn The Concept ({formulas.length} formulas)</h3>
            {formulas.map((f:any,i:number)=>(
              <div key={i} style={{padding:12, margin:"8px 0", background:"#eef2ff", borderRadius:10, border:"1px solid #c7d2fe"}}>
                <b style={{fontSize:16, color:"#000"}}>{f.f || f.formula || f}</b>
                <div style={{color:"#444", fontSize:13}}>{f.desc || f.description || ""}</div>
              </div>
            ))}
          </div>
        )}
        {active===2 && (
          <div>
            <h3>📝 Worked Examples ({worked.length})</h3>
            {worked.map((w:any,i:number)=>(
              <div key={i} style={{padding:12, margin:"10px 0", border:"1px solid #e5e7eb", borderRadius:12}}>
                <b>Q{i+1}: {w.q || w.question || w.title || "Example"}</b>
                <ol style={{paddingLeft:18}}>{(w.steps||w.solution||[]).map((s:string,j:number)=><li key={j} style={{margin:"6px 0"}}>{s}</li>)}</ol>
                {w.answer && <p><b>Answer:</b> {w.answer}</p>}
              </div>
            ))}
          </div>
        )}
        {active===3 && (
          <div>
            <h3>⚠️ Examiner Traps ({errors.length})</h3>
            {errors.map((e:any,i:number)=><div key={i} style={{padding:10, margin:"6px 0", background:"#fef2f2", borderRadius:8, color:"#991b1b"}}>• {e.text || e.msg || e}</div>)}
            <h3 style={{marginTop:16}}>💡 Tips ({tips.length})</h3>
            {tips.map((t:any,i:number)=><div key={i} style={{padding:10, margin:"6px 0", background:"#ecfdf5", borderRadius:8, color:"#065f46"}}>• {t.text || t.tip || t}</div>)}
          </div>
        )}
        {active===4 && (
          <div>
            <h3>🏆 Exam Challenge ({checklist.length})</h3>
            {checklist.map((c:any,i:number)=><div key={i} style={{padding:12, display:"flex", gap:10, borderBottom:"1px solid #f3f4f6"}}><span>☐</span><span>{c.text || c.q || c.question || c}</span></div>)}
            {checklist.length===0 && <p style={{opacity:0.6}}>No checklist found. Keys in master: {Object.keys(master).join(", ")}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
