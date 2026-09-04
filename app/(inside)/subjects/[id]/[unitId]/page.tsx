"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../../lib/subjects";

export default function UnitPage(){
 const p=useParams() as any;
 let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences";
 const uid=p.unitId as string;
 const subj=(SUBJECTS_DATA as any)[sid];
 const unit = subj?.sections?.flatMap((s:any)=>s.units).find((u:any)=>u.id===uid);

 if(!unit) return <div style={{padding:20,color:"#fff"}}>Unit not found</div>;

 return(
  <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
   {/* Breadcrumb */}
   <div style={{padding:"12px 16px 0",fontSize:13,color:"#6b7280",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
    <Link href="/subjects" style={{color:"#6b7280",textDecoration:"none"}}>Subjects</Link> <span>›</span>
    <Link href={`/subjects/${sid}`} style={{color:"#6b7280",textDecoration:"none"}}>{subj?.name}</Link> <span>›</span>
    <span style={{color:"#e5e7eb"}}>{unit.title}</span>
   </div>

   <div style={{padding:"12px 16px 0",fontSize:11,color:"#6b7280",letterSpacing:1.2}}>UNIT</div>
   <h1 style={{fontSize:28,fontWeight:900,padding:"2px 16px 18px",lineHeight:"1.15"}}>{unit.title}</h1>

   {/* TOPICS - NEAT LIKE SCREENSHOT */}
   <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:14}}>
    {unit.topics?.map((t:any, idx:number)=>(
     <Link key={t.id||idx} href={`/subjects/${sid}/${uid}/${t.id||idx}`} style={{textDecoration:"none"}}>
      <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:24,padding:"18px 16px"}}>
       <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:12}}>{t.title}</div>

       <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
        {/* Video Lesson */}
        <div style={{display:"flex",alignItems:"center",gap:6,background:"#252a5a",border:"1px solid #3a3f8a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#8b8bff",fontWeight:600}}>
          <span>◧</span> Video Lesson <span style={{background:"#3a3f8a",padding:"2px 6px",borderRadius:6,fontSize:10,marginLeft:4}}>INCLUDED</span>
        </div>
        {/* Practice */}
        <div style={{display:"flex",alignItems:"center",gap:5,background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#9aa0b6"}}>
          <span>☰</span> Practice
        </div>
        {/* Exam Challenge */}
        <div style={{display:"flex",alignItems:"center",gap:5,background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#9aa0b6"}}>
          <span>⎙</span> Exam Challenge
        </div>
        {/* Completed */}
        <div style={{display:"flex",alignItems:"center",gap:5,background:"#0f2a1e",border:"1px solid #14532d",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#4ade80",fontWeight:700}}>
          <span>✔</span> Completed
        </div>
       </div>
      </div>
     </Link>
    ))}
   </div>
  </div>
 )
}
