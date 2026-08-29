import { SUBJECTS_DATA } from "../../../../../lib/subjects";
import Link from "next/link";
export default function Page({params}:any){
  const subj=(SUBJECTS_DATA as any)[params.id];
  let unit:any=null; let topic:any=null;
  if(subj){
    for(const s of subj.sections){
      for(const u of s.units){
        if(u.id===params.unitId){
          unit=u;
          topic=(u.topics||[]).find((t:any)=>t.id===params.topicId)||{id:params.topicId,title:params.topicId};
        }
      }
    }
  }
  if(!unit) return <div style={{background:"#0f0f13",minHeight:"100vh",color:"white",padding:20}}>Not found</div>;
  return (
    <div style={{background:"#0f0f13",minHeight:"100vh",color:"white",padding:20}}>
      <Link href={`/subjects/${params.id}/${params.unitId}`} style={{color:"#9ca3af",textDecoration:"none"}}>{"<"} Back</Link>
      <h1 style={{fontSize:26,fontWeight:800,marginTop:16}}>{topic.title}</h1>
      <div style={{marginTop:20,background:"#000",borderRadius:20,border:"1px solid #27272a",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center"}}>Video Ready</div>
    </div>
  );
}
