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
  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:90}}>
      <div style={{padding:"16px 20px 0"}}>
        <Link href={`/subjects/${id}`} style={{color:"#9ca3af", fontSize:14, textDecoration:"none"}}>{"<"} {subject?.name}</Link>
        <div style={{marginTop:10, fontSize:12, color:"#71717a", letterSpacing:1}}>UNIT</div>
        <h1 style={{fontSize:28, fontWeight:800, marginTop:2}}>{unit.title}</h1>
      </div>
      <div style={{padding:"16px", display:"flex", flexDirection:"column", gap:14, marginTop:8}}>
        {(unit.topics||[]).map((t:any)=>{
          const isSpecial = t.title.toLowerCase().includes("series and sums") || t.title.toLowerCase().includes("friction") || t.title.toLowerCase().includes("connected");
          return (
            <Link key={t.id} href={`/subjects/${id}/${unitId}/${t.id}`} style={{textDecoration:"none"}}>
              <div style={{background:"#18181b", borderRadius:22, padding:18, border:"1px solid #232326"}}>
                <div style={{fontWeight:700, fontSize:19, color:"white"}}>{t.title}</div>
                <div style={{display:"flex", gap:8, marginTop:12, flexWrap:"wrap"}}>
                  {!isSpecial && <span style={{fontSize:12, padding:"6px 10px", borderRadius:12, background:"#24243e", color:"#818cf8", fontWeight:600}}>⧉ Video Lesson <span style={{background:"#36368a", padding:"2px 7px", borderRadius:6, marginLeft:4, fontSize:10}}>INCLUDED</span></span>}
                  <span style={{fontSize:12, padding:"6px 10px", borderRadius:12, background:"#1e1e22", color:"#9ca3af"}}>Practice</span>
                  <span style={{fontSize:12, padding:"6px 10px", borderRadius:12, background:"#1e1e22", color:"#9ca3af"}}>Exam Challenge</span>
                  <span style={{fontSize:12, padding:"5px 10px", borderRadius:20, background:"#102a1d", color:"#22c55e", border:"1px solid #14532d"}}>✓ Completed</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
