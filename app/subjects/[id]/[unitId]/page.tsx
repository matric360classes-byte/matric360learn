import { SUBJECTS_DATA } from "../../../../../lib/subjects";
import Link from "next/link";

function findData(sid:string, uid:string, tid:string){
  const subj=(SUBJECTS_DATA as any)[sid];
  if(!subj) return {unit:null, topic:null};
  for(const sec of subj.sections){
    for(const u of sec.units){
      if(u.id===uid){
        const topic=(u.topics||[]).find((t:any)=>t.id===tid) || {id:tid, title:tid.replace(/-/g,' ').toUpperCase()};
        return {unit:u, topic};
      }
    }
  }
  return {unit:null, topic:null};
}

export default function Page({params}:any){
  const {unit, topic}=findData(params.id, params.unitId, params.topicId);
  if(!unit ||!topic) return <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", padding:20}}>Not found</div>;
  return (
    <div style={{background:"#0f0f13", minHeight:"100vh", color:"white", paddingBottom:80}}>
      <div style={{padding:20}}>
        <Link href={`/subjects/${params.id}/${params.unitId}`} style={{color:"#9ca3af", textDecoration:"none"}}>{"<"} {unit.title}</Link>
        <h1 style={{fontSize:26, fontWeight:800, marginTop:14}}>{topic.title}</h1>
      </div>
      <div style={{margin:"0 16px", background:"#000", borderRadius:20, overflow:"hidden", border:"1px solid #27272a", aspectRatio:"16/9", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <div style={{width:68, height:48, background:"#ff0000", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center"}}>
          <div style={{width:0, height:0, borderLeft:"16px solid white", borderTop:"10px solid transparent", borderBottom:"10px solid transparent", marginLeft:4}}></div>
        </div>
      </div>
      <div style={{padding:16, display:"flex", flexDirection:"column", gap:12, marginTop:10}}>
        {["A - Exam Hook","B - Learn Concept","C - Worked Example","D - Examiner Traps","E - Exam Challenge"].map(k=>(
          <div key={k} style={{background:"#18181b", borderRadius:16, padding:16, border:"1px solid #27272a", display:"flex", gap:12}}>
            <div style={{width:36, height:36, borderRadius:18, background:"#1e1e32", display:"flex", alignItems:"center", justifyContent:"center", color:"#818cf8", fontWeight:800}}>{k[0]}</div>
            <div style={{fontWeight:700}}>{k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
