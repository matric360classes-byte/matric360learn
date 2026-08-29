import { SUBJECTS_DATA } from "../../../../lib/subjects";
import Link from "next/link";
export default function Page({params}:any){
  const subj = (SUBJECTS_DATA as any)[params.id];
  let unit:any = null;
  let topics:any[] = [];
  try{
    if(subj?.sections){
      for(const sec of subj.sections){
        for(const u of (sec.units||[])){
          if(u.id === params.unitId){
            unit = u;
            // your topics are stored as units inside? or topics? handle both
            topics = u.topics || (u as any).units || [];
            break;
          }
          // also check if topics are nested directly inside this u without key (your file)
          const maybeNested = (u as any).topics || (u as any).units || [];
          for(const t of maybeNested){
            if(t.id === params.unitId){
              unit = t;
              topics = t.topics || t.units || [];
              break;
            }
          }
        }
        if(unit) break;
      }
    }
  }catch(e){}

  if(!unit){
    return <div style={{background:"#0f0f13",minHeight:"100vh",color:"white",padding:20}}>Unit {params.unitId} not found - <Link href={`/subjects/${params.id}`} style={{color:"#9ca3af"}}>Back</Link></div>;
  }

  // If this unit itself is a leaf (like arithmetic-sequences), topics may be empty - that's ok
  // If topics empty, try to find sibling topics from parent
  if(topics.length===0){
    try{
      for(const sec of subj.sections){
        for(const u of (sec.units||[])){
          const nested = (u as any).topics || (u as any).units || [];
          if(nested.find((x:any)=>x.id===params.unitId)){
            // this u is parent of our unit, not needed
          }
          if(u.id===params.unitId){
            // already
          }
        }
      }
    }catch{}
  }

  return (
    <div style={{background:"#0f0f13",minHeight:"100vh",color:"white",padding:20}}>
      <Link href={`/subjects/${params.id}`} style={{color:"#9ca3af",textDecoration:"none"}}>{"<"} Back to {subj?.name||params.id}</Link>
      <h1 style={{fontSize:28,fontWeight:800,marginTop:16}}>{unit.title||unit.id}</h1>
      <p style={{color:"#71717a",marginTop:8}}>{unit.unit||""}</p>
      
      <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:12}}>
        {topics.length>0 ? topics.map((t:any)=>(
          <Link key={t.id} href={`/subjects/${params.id}/${params.unitId}/${t.id}`} style={{background:"#18181b",border:"1px solid #27272a",padding:16,borderRadius:16,color:"white",textDecoration:"none",display:"flex",justifyContent:"space-between"}}>
            <span>{t.title||t.id}</span><span>→</span>
          </Link>
        )) : (
          <div style={{background:"#18181b",border:"1px solid #27272a",padding:16,borderRadius:16}}>
            <p style={{color:"#9ca3af"}}>This unit has no sub-topics yet. Click below to open lesson:</p>
            <Link href={`/subjects/${params.id}/${params.unitId}/${params.unitId}`} style={{background:"white",color:"black",padding:"12px 20px",borderRadius:12,display:"inline-block",marginTop:12,textDecoration:"none",fontWeight:700}}>Open Lesson</Link>
          </div>
        )}
      </div>
    </div>
  );
}
