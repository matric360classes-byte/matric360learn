"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../../lib/subjects";
export default function UnitPage(){
 const p=useParams() as any;
 let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences";
 let uid=p.unitId as string;
 const subj=(SUBJECTS_DATA as any)[sid];
 const allUnits=subj?.sections?.flatMap((s:any)=>s.units)||[];
 const unit=allUnits.find((u:any)=>u.id===uid);
 return(
  <div style={{background:"#0a0a12",minHeight:"100vh",color:"#fff",padding:16}}>
   <Link href={`/subjects/${sid}`} style={{color:"#8a8a9a",textDecoration:"none"}}>{"<"} {subj?.name}</Link>
   <h1 style={{fontSize:22,fontWeight:900,marginTop:12}}>{unit?.title||uid}</h1>
   <div style={{marginTop:20,display:"grid",gap:12}}>
    {unit?.topics?.map((t:any)=>(
     <Link key={t.id} href={`/subjects/${sid}/${uid}/${t.id}`} style={{textDecoration:"none"}}>
      <div style={{background:"#1c1c28",padding:16,borderRadius:16,borderLeft:"4px solid #10b981"}}>
       <div style={{color:"#fff",fontWeight:800}}>{t.title}</div>
       <div style={{color:"#6b7280",fontSize:12}}>YouTube + Nodes A-E</div>
      </div>
     </Link>
    ))}
   </div>
  </div>
 )
}
