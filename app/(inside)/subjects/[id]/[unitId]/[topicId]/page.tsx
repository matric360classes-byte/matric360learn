"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../../../lib/subjects";
export default function TopicPage(){
 const p=useParams() as any;
 let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences";
 let uid=p.unitId as string; let tid=p.topicId as string;
 const subj=(SUBJECTS_DATA as any)[sid];
 const allUnits=subj?.sections?.flatMap((s:any)=>s.units)||[];
 const unit=allUnits.find((u:any)=>u.id===uid);
 const topic=(unit?.topics||[]).find((t:any)=>t.id===tid);
 const yt=topic?.youtubeId||"dQw4w9WgXcQ";
 const nodes=[
  {id:"A",label:"Explanation - Mind the Gap",color:"#10b981",text:`Full 80min lesson breakdown for ${topic?.title||tid}. Follow Mind the Gap page by page.`},
  {id:"B",label:"Formulas, Laws & Definitions",color:"#3b82f6",text:"Key formulas and definitions you MUST memorize for exams."},
  {id:"C",label:"Worked Examples - Step by Step",color:"#f59e0b",text:"DBE past paper examples solved step by step."},
  {id:"D",label:"Common Mistakes - Where Learners Lose Marks",color:"#ef4444",text:"Stop losing marks! Top mistakes for this topic."},
  {id:"E",label:"Exam Tip - Mind the Gap Final",color:"#06b6d4",text:"DBE Tip: 80min video = 1 full exam section. Watch active with notes."},
 ];
 return(
  <div style={{background:"#0a0a12",minHeight:"100vh",color:"#fff"}}>
   <div style={{padding:16}}>
    <Link href={`/subjects/${sid}/${uid}`} style={{color:"#8a8a9a",textDecoration:"none"}}>{"<"} {unit?.title}</Link>
    <h1 style={{fontSize:20,fontWeight:900,marginTop:12}}>{topic?.title||tid}</h1>
   </div>
   <div style={{margin:"0 16px",background:"#000",borderRadius:20,overflow:"hidden",aspectRatio:"16/9"}}>
    <iframe style={{width:"100%",height:"100%",border:0}} src={`https://www.youtube.com/embed/${yt}`} allowFullScreen />
   </div>
   <div style={{padding:16,display:"grid",gap:12,marginTop:12}}>
    {nodes.map(n=>(
     <div key={n.id} style={{background:"#1c1c28",borderLeft:`4px solid ${n.color}`,borderRadius:12,padding:14}}>
      <div style={{fontSize:11,letterSpacing:2,color:"#6b7280",fontWeight:800}}>{n.id}: {n.label}</div>
      <div style={{marginTop:8,fontSize:13,color:"#a1a1b5"}}>{n.text}</div>
     </div>
    ))}
   </div>
  </div>
 )
}
