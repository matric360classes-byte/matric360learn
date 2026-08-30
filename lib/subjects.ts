"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../lib/subjects";
export default function Page(){
  const p = useParams();
  let id = (p?.id as string) || "mathematics";
  if(id==="physical-science") id="physical-sciences";
  const s = (SUBJECTS_DATA as any)[id] || (SUBJECTS_DATA as any).mathematics;
  const secs = s?.sections || [];
  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", padding:20, color:"#fff"}}>
      <Link href="/" style={{color:"#8a8a9a"}}>{"<"} Home</Link>
      <h1 style={{fontSize:28, fontWeight:800, marginTop:10}}>{s?.name || id}</h1>
      {secs.map((sec:any,i:number)=><div key={i} style={{marginTop:16}}>
        <div style={{color:"#888", marginBottom:8}}>{sec.title}</div>
        {(sec.units||[]).map((u:any)=><Link key={u.id} href={`/subjects/${id}/${u.id}`} style={{textDecoration:"none"}}><div style={{background:"#1c1c28", border:"1px solid #2a2a3a", borderRadius:16, padding:14, marginBottom:10, color:"#fff"}}><div style={{fontSize:10, color:"#777"}}>{u.unit}</div><div style={{fontWeight:800}}>{u.title}</div></div></Link>)}
      </div>)}
    </div>
  );
}
