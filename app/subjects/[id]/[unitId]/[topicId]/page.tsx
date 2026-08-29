import { SUBJECTS_DATA } from "../../../../../lib/subjects";
import Link from "next/link";

export default function Page({params}:any){
  const subj = (SUBJECTS_DATA as any)[params.id];
  let topic:any = null;
  let unit:any = null;
  try{
    if(subj?.sections){
      for(const sec of subj.sections){
        for(const u of (sec.units||[])){
          if(u.id===params.unitId) unit=u;
          const list = u.topics || (u as any).units || [];
          for(const t of list){
            if(t.id===params.topicId){
              topic=t;
              unit=u;
            }
          }
          // also topic could be a unit itself
          if(u.id===params.topicId){
            topic=u;
          }
        }
      }
    }
  }catch(e){}

  if(!topic) topic = { title: params.topicId, id: params.topicId };

  return (
    <div style={{background:"#0f0f13",minHeight:"100vh",color:"white",padding:20}}>
      <Link href={`/subjects/${params.id}/${params.unitId}`} style={{color:"#9ca3af",textDecoration:"none"}}>{"<"} Back</Link>
      
      <h1 style={{fontSize:26,fontWeight:800,marginTop:16}}>{topic.title||topic.id}</h1>
      <p style={{color:"#71717a",marginTop:4}}>{unit?.title||""} • {params.topicId}</p>

      <div style={{marginTop:20,background:"#000",border:"1px solid #27272a",borderRadius:20,aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
        <div style={{fontSize:40}}>▶️</div>
        <p style={{color:"#9ca3af"}}>Video Player Ready</p>
        <p style={{color:"#52525b",fontSize:12}}>ID: {params.topicId}</p>
      </div>

      <div style={{marginTop:20,background:"#18181b",border:"1px solid #27272a",borderRadius:16,padding:16}}>
        <h3 style={{fontWeight:700}}>Lesson Notes</h3>
        <p style={{color:"#9ca3af",marginTop:8,fontSize:14}}>This is where your YouTube video will play. Next step: paste YouTube link and it will show here automatically.</p>
      </div>
    </div>
  );
}
