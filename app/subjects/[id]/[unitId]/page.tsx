import { SUBJECTS_DATA } from "../../../../lib/subjects";
import Link from "next/link";

function findUnit(subjectId: string, unitId: string){
  const subj = (SUBJECTS_DATA as any)[subjectId];
  if(!subj) return null;
  for(const sec of subj.sections){
    for(const u of sec.units){
      if(u.id === unitId) return u;
    }
  }
  return null;
}

export default function Page({ params }: any){
  const { id, unitId } = params;
  const unit: any = findUnit(id, unitId);
  const subject: any = (SUBJECTS_DATA as any)[id];

  if(!unit){
    return <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>Unit not found: {unitId} for {id}</div>;
  }

  const count = typeof unit.topics === "number"? unit.topics : (unit.topics?.length || 5);
  const topics = Array.isArray(unit.topics)? unit.topics : Array.from({length: count}, (_,i)=>({ id: `topic-${i+1}`, title: `${unit.title} - Lesson ${i+1}` }));

  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:80}}>
      <div style={{padding:20}}>
        <Link href={`/subjects/${id}`} style={{color:"#9ca3af", fontSize:14, textDecoration:"none"}}>{"<"} {subject?.name}</Link>
        <div style={{marginTop:10, fontSize:11, color:"#71717a", letterSpacing:1}}>{unit.unit} · {count} topics</div>
        <h1 style={{fontSize:28, fontWeight:800, marginTop:4}}>{unit.title}</h1>
      </div>
      <div style={{padding:"0 16px", display:"flex", flexDirection:"column", gap:12}}>
        {topics.map((t:any, idx:number)=>(
          <Link key={idx} href={`/subjects/${id}/${unitId}/${t.id || `topic-${idx+1}`}`} style={{textDecoration:"none"}}>
            <div style={{background:"#18181b", borderRadius:20, padding:18, border:"1px solid #27272a"}}>
              <div style={{fontWeight:700, fontSize:17, color:"white"}}>{t.title || t}</div>
              <div style={{display:"flex", gap:8, marginTop:12}}>
                <span style={{fontSize:11, padding:"5px 10px", borderRadius:10, background:"#2a2a4a", color:"#818cf8"}}>🎥 Video</span>
                <span style={{fontSize:11, padding:"5px 10px", borderRadius:10, background:"#1f1f23", color:"#9ca3af"}}>📋 Notes</span>
                <span style={{fontSize:11, padding:"5px 10px", borderRadius:10, background:"#1f1f23", color:"#9ca3af"}}>📄 Exam</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
