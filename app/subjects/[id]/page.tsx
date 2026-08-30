"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SUBJECTS_DATA } from "../../../lib/subjects";
export default function Page(){
  const p=useParams(); let id=(p?.id as string)||"mathematics"; if(id==="physical-science") id="physical-sciences";
  const s=(SUBJECTS_DATA as any)[id]||(SUBJECTS_DATA as any).mathematics;
  return(<div style={{background:"#0a0a12",minHeight:"100vh",padding:20,color:"#fff"}}><h1>{s?.name}</h1>{(s?.sections||[]).map((sec:any,i:number)=><div key={i}>{(sec.units||[]).map((u:any)=><Link key={u.id} href={`/subjects/${id}/${u.id}`}><div style={{background:"#1c1c28",padding:14,marginTop:10,borderRadius:12,color:"#fff"}}>{u.title}</div></Link>)}</div>)}</div>);
}
