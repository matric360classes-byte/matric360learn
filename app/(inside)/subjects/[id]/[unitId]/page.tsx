"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "@/lib/subjects";
export default function Page(){
  const p=useParams() as any; let sid=p.id||"mathematics"; if(sid==="physical-science") sid="physical-sciences"; const uid=p.unitId;
  const subj=(SUBJECTS_DATA as any)[sid]; const unit=subj?.sections?.flatMap((s:any)=>s.units||[])?.find((u:any)=>u.id===uid);
  const topics=unit?.topics||unit?.subTopics||[];
  return(<div style={{background:"#0a0a12",minHeight:"100vh",padding:20,color:"#fff"}}><Link href={`/subjects/${sid}`} style={{color:"#888"}}>{"<"} Back</Link><h1 style={{marginTop:10}}>{unit?.title||uid}</h1>{topics.map((t:any)=><Link key={t.id} href={`/subjects/${sid}/${uid}/${t.id}`}><div style={{background:"#1c1c28",padding:14,marginTop:10,borderRadius:12,color:"#fff"}}>{t.title}</div></Link>)}</div>);
}
