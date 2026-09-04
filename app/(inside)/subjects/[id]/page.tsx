"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../lib/subjects";
export default function SubjectIdPage(){
 const p=useParams() as any;
 let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences";
 const subj=(SUBJECTS_DATA as any)[sid];
 const units=subj?.sections?.flatMap((s:any)=>s.units)||[];
 return(
  <div style={{padding:"8px 4px 90px"}}>
   <Link href="/subjects" style={{color:"#8a8a9a",textDecoration:"none"}}>{"<"} Subjects</Link>
   <h1 style={{fontSize:26,fontWeight:900,margin:"12px 0 16px 4px"}}>{subj?.name||sid}</h1>
   <div style={{display:"flex",flexDirection:"column",gap:12}}>
    {units.map((u:any)=>(
     <Link key={u.id} href={`/subjects/${sid}/${u.id}`} style={{textDecoration:"none"}}>
      <div style={{background:"#1a1f35",border:"1px solid #2a324f",borderRadius:18,padding:"16px"}}>
       <div style={{fontSize:18,fontWeight:800}}>{u.title}</div>
       <div style={{fontSize:14,color:"#a1a1b5",marginTop:4}}>{u.topics?.length||0} topics • Tap to open</div>
      </div>
     </Link>
    ))}
   </div>
  </div>
 )
}
