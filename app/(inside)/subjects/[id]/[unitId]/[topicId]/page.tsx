"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "@/lib/subjects";
export default function TopicPage(){
  const p=useParams() as any; let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences"; const uid=p.unitId as string; const tid=p.topicId as string;
  const subj=(SUBJECTS_DATA as any)[sid]; const unit=subj?.sections?.flatMap((s:any)=>s.units)?.find((u:any)=>u.id===uid);
  const topic=(unit?.topics||[])?.find((t:any)=>t.id===tid);
  const yt=topic?.youtubeId||"dQw4w9WgXcQ";
  const nodes=[
    { id:"A", label:"Explanation - Mind the Gap", color:"#10b981", text:`Full 80min lesson breakdown for ${topic?.title}. Key definitions, concepts, and CAPS overview as per Mind the Gap Grade 12.` },
    { id:"B", label:"Formulas, Laws & Definitions", color:"#6366f1", text:"All formulas you must memorise. Write them down. Examiners award marks for correct formula even if answer wrong." },
    { id:"C", label:"Worked Examples - Step by Step", color:"#f59e0b", text:"Teacher works through 3-4 examples: Identify formula, Substitute, Solve, Check units. Follow same method in exam." },
    { id:"D", label:"Common Mistakes - Where Learners Lose Marks", color:"#ef4444", text:"Sign errors, forgetting units, not showing steps, calculator in wrong mode (DEG), rounding too early." },
    { id:"E", label:"Exam Tip - Mind the Gap Final", color:"#06b6d4", text:"DBE Tip: 80min video covers 20 marks section. Show ALL working, include units, box final answer. Time: 1.5 min per mark." },
  ];
  return(
    <div style={{background:"#0a0a12",minHeight:"100vh",color:"#fff"}}>
      <div style={{padding:"16px"}}>
        <Link href={`/subjects/${sid}/${uid}`} style={{color:"#8a8a9a",textDecoration:"none",fontSize:13}}>{'<'} Back to {unit?.title}</Link>
        <h1 style={{fontSize:20,fontWeight:900,marginTop:12,lineHeight:1.2}}>{topic?.title||tid}</h1>
        <div style={{fontSize:11,color:"#6b7280",marginTop:6,display:"flex",gap:8}}><span style={{background:"#1c1c28",padding:"4px 8px",borderRadius:999}}>{subj?.name}</span><span style={{background:"#1c1c28",padding:"4px 8px",borderRadius:999}}>{unit?.unit}</span><span style={{background:"#10b981",color:"#000",padding:"4px 8px",borderRadius:999,fontWeight:800}}>80 MIN READY</span></div>
      </div>
      <div style={{margin:"0 16px",background:"#000",borderRadius:20,overflow:"hidden",border:"1px solid #1e1e2a",position:"relative"}}>
        <div style={{aspectRatio:"16/9",width:"100%"}}>
          <iframe style={{width:"100%",height:"100%",border:0}} src={`https://www.youtube.com/embed/${yt}?rel=0&modestbranding=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title={topic?.title}/>
        </div>
        <div style={{padding:"10px 14px",background:"#11111a",display:"flex",justifyContent:"space-between",fontSize:11,color:"#6b7280"}}><span>▶ Mind the Gap Grade 12 • Supports 80min+ lessons</span><span>HD • Captions • Speed control</span></div>
      </div>
      <div style={{padding:16}}>
        <div style={{fontSize:11,letterSpacing:2,color:"#6b7280",fontWeight:800,marginBottom:12}}>LEARNING NODES • 5 STEPS • MIND THE GAP</div>
        {nodes.map(n=>(
          <div key={n.id} style={{background:"#1c1c28",borderLeft:`4px solid ${n.color}`,borderRadius:12,padding:16,marginBottom:12}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><div style={{background:n.color,color:"#000",width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12}}>{n.id}</div><div style={{fontWeight:800,fontSize:13}}>{n.label}</div></div>
            <div style={{marginTop:10,color:"#a1a1b5",fontSize:13,lineHeight:"1.6"}}>{n.text}</div>
          </div>
        ))}
        <div style={{marginTop:20,background:"#1c1c28",borderRadius:16,padding:16,border:"1px dashed #2a2a3a"}}>
          <div style={{fontSize:12,fontWeight:800,color:"#fff"}}>Video Length Info:</div>
          <div style={{fontSize:12,color:"#8a8a9a",marginTop:6,lineHeight:1.5}}>This player supports YouTube videos up to 12 hours. Your 80min Mind the Gap lessons will play fully with pause, rewind, 1.25x, 1.5x, 2x speed, captions, and fullscreen. No cut-off.</div>
        </div>
        <Link href={`/subjects/${sid}/${uid}`} style={{textDecoration:"none"}}><div style={{marginTop:20,background:"#fff",color:"#000",borderRadius:999,padding:16,textAlign:"center",fontWeight:900}}>Next Subtopic →</div></Link>
      </div>
    </div>
  );
}
