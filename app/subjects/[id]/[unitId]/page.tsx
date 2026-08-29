import { SUBJECTS_DATA } from "../../../../lib/subjects";
import Link from "next/link";

function findUnit(sid:string, uid:string){
  const subj=(SUBJECTS_DATA as any)[sid];
  if(!subj) return null;
  for(const sec of subj.sections){ for(const u of sec.units){ if(u.id===uid) return u; } }
  return null;
}

export default function Page({ params }: any){
  const { id, unitId } = params;
  const unit:any = findUnit(id, unitId);
  const subject:any = (SUBJECTS_DATA as any)[id];
  if(!unit) return <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>Not found</div>;
  const topics = Array.isArray(unit.topics)? unit.topics : [];
  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:90}}>
      <div style={{padding:20}}>
        <Link href={`/subjects/${id}`} style={{color:"#9ca3af", fontSize:14, textDecoration:"none"}}>{"<"} {subject?.name}</Link>
        <div style={{marginTop:10, fontSize:11, color:"#71717a", letterSpacing:1}}>{unit.unit}</div>
        <h1 style={{fontSize:28, fontWeight:800, marginTop:4}}>{unit.title}</h1>
      </div>
      <div style={{padding:"0 16px", display:"flex", flexDirection:"column", gap:12}}>
        {topics.map((t:any)=>(
          <Link key={t.id} href={`/subjects/${id}/${unitId}/${t.id}`} style={{textDecoration:"none"}}>
            <div style={{background:"#18181b", borderRadius:20, padding:18, border:"1px solid #27272a"}}>
              <div style={{fontWeight:700, fontSize:18, color:"white"}}>{t.title}</div>
              <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap", alignItems:"center"}}>
                <span style={{fontSize:11, padding:"6px 10px", borderRadius:10, background:"#2a2a4a", color:"#818cf8", fontWeight:600, display:"flex", gap:4}}><span>▶</span> Video Lesson <span style={{background:"#4f46e5", color:"white", padding:"1px 6px", borderRadius:6, marginLeft:4}}>INCLUDED</span></span>
                <span style={{fontSize:11, padding:"6px 10px", borderRadius:10, background:"#1f1f23", color:"#9ca3af"}}>📋 Practice</span>
                <span style={{fontSize:11, padding:"6px 10px", borderRadius:10, background:"#1f1f23", color:"#9ca3af"}}>📄 Exam Challenge</span>
                <span style={{fontSize:11, padding:"5px 10px", borderRadius:20, background:"#0f2a1f", color:"#22c55e", border:"1px solid #14532d"}}>✓ Completed</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
