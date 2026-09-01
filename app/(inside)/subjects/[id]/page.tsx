"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../lib/subjects";
export default function Page(){
  const p=useParams(); let id=(p?.id as string)||"mathematics"; if(id==="physical-science") id="physical-sciences";
  const s=(SUBJECTS_DATA as any)[id] || (SUBJECTS_DATA as any).mathematics;
  return(
    <div style={{background:"#0a0a12",minHeight:"100vh",padding:"20px 16px",color:"#fff"}}>
      <Link href="/" style={{color:"#8a8a9a",textDecoration:"none"}}>{'<'} Home</Link>
      <h1 style={{fontSize:32,fontWeight:900,marginTop:12}}>{s.name}</h1>
      <p style={{color:"#8a8a9a"}}>{s.desc}</p>
      {s.sections.map((sec:any,si:number)=>(
        <div key={si} style={{marginTop:28}}>
          <div style={{fontSize:12,letterSpacing:2,color:"#6b7280",fontWeight:800,marginBottom:12,borderBottom:"1px solid #1e1e2a",paddingBottom:8}}>{sec.title.toUpperCase()}</div>
          {sec.units.map((u:any)=>(
            <Link key={u.id} href={`/subjects/${id}/${u.id}`} style={{textDecoration:"none"}}>
              <div style={{background:"linear-gradient(135deg,#1c1c28,#151520)",border:"1px solid #2a2a3a",borderRadius:16,padding:16,marginBottom:12}}>
                <div style={{fontSize:10,color:"#10b981",fontWeight:800}}>{u.unit}</div>
                <div style={{fontWeight:800,color:"#fff",marginTop:4}}>{u.title}</div>
                <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{u.topics?.length||0} topics</div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
