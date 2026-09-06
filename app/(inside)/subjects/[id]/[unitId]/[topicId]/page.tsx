"use client";
import { useState } from "react";
import { buildNodesForTopic } from "@/lib/nodeFactory";

export default function Page({ params }: any) {
  const subjectId = params.id as string;
  const topicId = params.topicId as string;
  const lesson: any = buildNodesForTopic(topicId, subjectId);
  if (!lesson) return <div style={{padding:20}}>No lesson {topicId} in {subjectId}</div>;

  const NODES: any[] = lesson.nodes;
  const [active, setActive] = useState(0);
  const node: any = NODES[active];
  const d: any = node.data || node.content || {};

  return (
    <div style={{padding:16, maxWidth:800, margin:"0 auto"}}>
      <h2 style={{fontSize:22, fontWeight:800}}>{lesson.title}</h2>
      <p style={{opacity:0.6, fontSize:13}}>{subjectId} / {params.unitId} / {topicId}</p>

      <div style={{display:"flex", gap:8, overflowX:"auto", margin:"16px 0"}}>
        {NODES.map((n:any,i:number)=>(
          <button key={i} onClick={()=>setActive(i)} style={{padding:"10px 14px", whiteSpace:"nowrap", borderRadius:999, border:"1px solid #ccc", background:i===active?"#000":"#fff", color:i===active?"#fff":"#000", fontWeight:600}}>
            {n.id}: {n.label}
          </button>
        ))}
      </div>

      <div style={{border:"1px solid #e5e7eb", borderRadius:16, padding:16, background:"#fff"}}>
        {/* NODE A - EXAM HOOK */}
        {active===0 && (
          <div>
            <h3>📌 {d.title || lesson.title}</h3>
            <p>{d.intro || d.hook || "Exam focus for this topic."}</p>
            {d.examWeight && <p><b>Exam Weight:</b> {d.examWeight}</p>}
          </div>
        )}
        {/* NODE B - LEARN */}
        {active===1 && (
          <div>
            <h3>📚 Key Formulas</h3>
            {(d.formulas||[]).map((f:any,i:number)=>(
              <div key={i} style={{padding:10, margin:"8px 0", background:"#f6f7ff", borderRadius:10}}>
                <b>{f.f}</b> <span style={{opacity:0.7}}>{f.desc}</span>
              </div>
            ))}
            <p style={{marginTop:12}}>{d.intro}</p>
          </div>
        )}
        {/* NODE C - WORKED */}
        {active===2 && (
          <div>
            <h3>📝 Worked Examples</h3>
            {(d.worked||[]).map((w:any,i:number)=>(
              <div key={i} style={{marginBottom:16, padding:12, border:"1px solid #eee", borderRadius:12}}>
                <b>Q{i+1} [{w.source||""} {w.marks||""} marks]: {w.q}</b>
                <ol>{(w.steps||[]).map((s:string,j:number)=><li key={j} style={{margin:"4px 0"}}>{s}</li>)}</ol>
                {w.answer && <p><b>Answer:</b> {w.answer}</p>}
              </div>
            ))}
          </div>
        )}
        {/* NODE D - TRAPS */}
        {active===3 && (
          <div>
            <h3>⚠️ Examiner Traps</h3>
            <ul>{(d.errors||[]).map((e:string,i:number)=><li key={i} style={{color:"#b91c1c", margin:"6px 0"}}>{e}</li>)}</ul>
            <h3 style={{marginTop:12}}>💡 Tips</h3>
            <ul>{(d.tips||[]).map((t:string,i:number)=><li key={i} style={{margin:"6px 0"}}>{t}</li>)}</ul>
          </div>
        )}
        {/* NODE E - CHALLENGE */}
        {active===4 && (
          <div>
            <h3>🏆 Exam Checklist</h3>
            {(d.checklist||[]).map((c:string,i:number)=><div key={i} style={{padding:8, display:"flex", gap:8}}><span>☐</span><span>{c}</span></div>)}
          </div>
        )}
      </div>
    </div>
  );
}
