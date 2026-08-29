import { SUBJECTS_DATA } from "../../../../lib/subjects";
import Link from "next/link";

function findUnit(sid:string, uid:string){
  const subj=(SUBJECTS_DATA as any)[sid];
  if(!subj) return null;
  for(const sec of subj.sections){
    for(const u of sec.units){
      if(u.id===uid) return {unit:u, subject:subj};
    }
  }
  return null;
}

export default function Page({params}:any){
  const data=findUnit(params.id, params.unitId);
  if(!data) return <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>Not found</div>;
  const {unit, subject}=data;
  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>
      <Link href={`/subjects/${params.id}`} style={{color:"#9ca3af", textDecoration:"none"}}>{"<"} {subject.name}</Link>
      <h1 style={{fontSize:28, fontWeight:800, marginTop:16}}>{unit.title}</h1>
      <div style={{marginTop:20, display:"flex", flexDirection:"column", gap:12}}>
        {(unit.topics||[]).map((t:any)=>(
          <Link key={t.id} href={`/subjects/${params.id}/${params.unitId}/${t.id}`} style={{background:"#18181b", border:"1px solid #27272a", padding:16, borderRadius:16, color:"white", textDecoration:"none", display:"flex", justifyContent:"space-between"}}>
            <span>{t.title}</span><span>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
