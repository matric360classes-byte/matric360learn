"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../lib/subjects";

export default function SubjectIdPage(){
 const p=useParams() as any;
 let sid=p.id as string;
 if(sid==="physical-science") sid="physical-sciences";
 const subj=(SUBJECTS_DATA as any)[sid];
 const sections=subj?.sections||[];

 return(
  <div style={{padding:"8px 12px 100px",background:"#0a0a12",minHeight:"100vh",color:"#fff"}}>
   <Link href="/subjects" style={{color:"#8a8a9a",textDecoration:"none"}}>{"<"} Subjects</Link>
   <h1 style={{fontSize:26,fontWeight:900,margin:"12px 0 8px 0"}}>{subj?.name||sid}</h1>
   <div style={{color:"#6b7280",fontSize:13,marginBottom:20}}>CAPS Grade 12 • {sections.length} sections</div>

   {sections.map((sec:any)=>(
    <div key={sec.id||sec.title} style={{marginBottom:28}}>
     {/* Section Header - Physics / Chemistry */}
     <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <div style={{width:4,height:18,background: sec.title?.toLowerCase().includes("physics")? "#3b82f6" : "#10b981", borderRadius:2}}/>
      <h2 style={{fontSize:14,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"#e5e7eb"}}>{sec.title}</h2>
      <div style={{fontSize:11,background:"#1c1c28",color:"#8a8a9a",padding:"2px 8px",borderRadius:20}}>{sec.units?.length} units</div>
     </div>

     {/* Units inside this section */}
     <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {sec.units?.map((u:any)=>(
       <Link key={u.id} href={`/subjects/${sid}/${u.id}`} style={{textDecoration:"none"}}>
        <div style={{background:"#151a2f",border:"1px solid #252a44",borderRadius:16,padding:16,borderLeft:`4px solid ${sec.title?.toLowerCase().includes("physics")? "#3b82f6" : "#10b981"}`}}>
         <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{u.title}</div>
         <div style={{fontSize:12,color:"#8a8a9a",marginTop:4}}>{u.topics?.length||0} topics • Tap to open lessons</div>
        </div>
       </Link>
      ))}
     </div>
    </div>
   ))}
  </div>
 )
}
