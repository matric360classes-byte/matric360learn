"use client";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../../../lib/subjects";
export default function Page(){
  const p=useParams() as any; let sid=p.id||"mathematics"; if(sid==="physical-science") sid="physical-sciences";
  const subj=(SUBJECTS_DATA as any)[sid]; const unit=subj?.sections?.flatMap((s:any)=>s.units||[])?.find((u:any)=>u.id===p.unitId);
  const topic=(unit?.topics||unit?.subTopics||[])?.find((t:any)=>t.id===p.topicId);
  return(<div style={{background:"#0a0a12",minHeight:"100vh",padding:20,color:"#fff"}}><h1>{topic?.title||p.topicId}</h1><div style={{marginTop:20,background:"#000",aspectRatio:"16/9",borderRadius:12}}><iframe style={{width:"100%",height:"100%",border:0}} src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowFullScreen/></div></div>);
}
