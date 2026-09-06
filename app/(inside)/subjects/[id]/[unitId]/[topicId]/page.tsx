"use client";
import { useState } from "react";
import { buildNodesForTopic } from "@/lib/nodeFactory";

export default function Page({ params }: any) {
  const subjectId = params.id as string;
  const unitId = params.unitId as string;
  const topicId = params.topicId as string;

  // Try factory — if fails, create fallback
  let lesson: any = null;
  try { lesson = buildNodesForTopic(topicId, subjectId); } catch(e){ lesson = null; }

  // FALLBACK so every subtopic works
  if (!lesson) {
    lesson = {
      title: topicId.replace(/-/g, " ").replace(/\b\w/g, (l:string)=>l.toUpperCase()),
      nodes: [
        { id: "A", label: "Exam Hook", data: { intro: `This is ${topicId} — key CAPS topic in ${unitId}. Appears in Paper 1. High marks.` } },
        { id: "B", label: "Learn The Concept", data: { formulas: [{f: `${topicId} formula 1`, desc: "Main definition"}, {f: `${topicId} formula 2`, desc: "Derived"}] } },
        { id: "C", label: "Worked Example", data: { worked: [{q: `Example question for ${topicId}`, steps: ["Step 1: Identify given", "Step 2: Choose formula", "Step 3: Substitute & calculate"], answer: "Final answer with units"}] } },
        { id: "D", label: "Examiner Traps", data: { errors: ["Forgetting units", "Wrong sign convention"], tips: ["Always write formula first", "Check direction"] } },
        { id: "E", label: "Exam Challenge", data: { checklist: [`Define ${topicId}`, `State formula for ${topicId}`, `Solve 2 past paper Qs on ${topicId}`] } },
      ]
    };
  }

  const NODES: any[] = lesson.nodes || [];
  const [active, setActive] = useState(0);
  const node: any = NODES[active] || {};
  const master: any = NODES.find((n:any)=>(n.data||n.content)?.formulas)?.data || NODES[0]?.data || NODES[0]?.content || {};
  const data: any = node.data || node.content || master || {};

  const get = (keys: string[]) => {
    for (let k of keys) if (data[k] || master[k]) return data[k] || master[k];
    return [];
  };

  const formulas = get(["formulas","equations"]) || [];
  const worked = get(["worked","examples"]) || [];
  const errors = get(["errors","traps"]) || [];
  const tips = get(["tips"]) || [];
  const checklist = get(["checklist","challenge"]) || [];

  return (
    <div style={{padding:16, maxWidth:850, margin:"0 auto", color:"#111"}}>
      <a href={`/subjects/${subjectId}/${unitId}`} style={{fontSize:13, opacity:0.6}}>← Back to {unitId}</a>
      <h2 style={{fontSize:24, fontWeight:900, marginTop:8, color:"#000"}}>{lesson.title || topicId}</h2>
      <p style={{fontSize:12, opacity:0.6}}>{subjectId} / {unitId} / {topicId}</p>

      {/* YOUTUBE PLACEHOLDER BACK */}
      <div style={{margin:"16px 0", borderRadius:16, overflow:"hidden", background:"#000", aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center", position:"relative"}}>
        <div style={{color:"#fff", textAlign:"center"}}>
          <div style={{fontSize:48}}>▶️</div>
          <div style={{fontSize:14, marginTop:8}}>YouTube Video: {lesson.title}</div>
          <div style={{fontSize:11, opacity:0.7, marginTop:4}}>youtube.com/embed/{topicId}</div>
        </div>
      </div>

      <div style={{display:"flex", gap:8, overflowX:"auto", margin:"16px 0", paddingBottom:4}}>
        {NODES.map((n:any,i:number)=>(
          <button key={i} onClick={()=>setActive(i)} style={{padding:"10px 14px", borderRadius:999, border:"1px solid #999", background:i===active?"#000":"#fff", color:i===active?"#fff":"#000", fontWeight:700, whiteSpace:"nowrap", fontSize:13}}>
            {n.id}: {n.label}
          </button>
        ))}
      </div>

      <div style={{border:"1px solid #ddd", borderRadius:16, padding:16, background:"#fff", color:"#111", minHeight:200}}>
        {active===0 && <div><h3>📌 Exam Hook</h3><p>{data.intro || data.hook || master.intro || `What examiners look for in ${topicId}`}</p></div>}
        {active===1 && <div><h3>📚 Learn The Concept</h3>{formulas.map((f:any,i:number)=><div key={i} style={{padding:12, margin:"8px 0", background:"#eef2ff", borderRadius:10}}><b>{f.f || f}</b><div style={{fontSize:13, color:"#555"}}>{f.desc || ""}</div></div>)}</div>}
        {active===2 && <div><h3>📝 Worked Example</h3>{worked.map((w:any,i:number)=><div key={i} style={{padding:12, border:"1px solid #eee", borderRadius:12, margin:"8px 0"}}><b>{w.q || w.question}</b><ol style={{paddingLeft:18}}>{(w.steps||[]).map((s:string,j:number)=><li key={j}>{s}</li>)}</ol><p><b>Ans:</b> {w.answer||""}</p></div>)}</div>}
        {active===3 && <div><h3>⚠️ Examiner Traps</h3>{errors.map((e:any,i:number)=><div key={i} style={{padding:8, background:"#fef2f2", borderRadius:8, margin:"6px 0", color:"#991b1b"}}>• {e}</div>)}<h3 style={{marginTop:12}}>💡 Tips</h3>{tips.map((t:any,i:number)=><div key={i} style={{padding:8, background:"#ecfdf5", borderRadius:8, margin:"6px 0", color:"#065f46"}}>• {t}</div>)}</div>}
        {active===4 && <div><h3>🏆 Exam Challenge</h3>{checklist.map((c:any,i:number)=><div key={i} style={{padding:10, borderBottom:"1px solid #f3f4f6", display:"flex", gap:8}}><span>☐</span><span>{c}</span></div>)}</div>}
      </div>
    </div>
  );
}
