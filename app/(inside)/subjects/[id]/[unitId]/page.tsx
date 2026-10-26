"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SUBJECTS_DATA } from "../../../../lib/subjects";

const norm = (s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");

export default function UnitPage(){
 const p=useParams() as any;
 let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences";
 const uid=p.unitId as string;
 const subj=(SUBJECTS_DATA as any)[sid];
 const unit = subj?.sections?.flatMap((s:any)=>s.units).find((u:any)=>u.id===uid);
 const [done,setDone]=useState<Set<string>>(new Set());
 const [videos,setVideos]=useState<any[]>([]);

 useEffect(()=>{ try{ const s=localStorage.getItem("matric360_progress"); if(s) setDone(new Set(JSON.parse(s))); }catch{} },[]);

 useEffect(()=>{
  (async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`};
    const subjNorm=sid.toLowerCase().includes('math')?'mathematics':'physical-sciences';
    let res=await fetch(`${url}/rest/v1/videos?select=caps_code,topic,lesson_node_id,subject&limit=500`,{headers});
    let data:any=await res.json();
    if(!Array.isArray(data)) data=[];
    let filtered=data.filter((v:any)=> (v.subject||"").toLowerCase().includes(subjNorm.split('-')[0]) || !v.subject);
    const nodeIds=filtered.filter((v:any)=> !v.caps_code && !v.topic && v.lesson_node_id).map((v:any)=>v.lesson_node_id);
    if(nodeIds.length){
      const inList=nodeIds.map((id:string)=>`"${id}"`).join(',');
      const resNodes=await fetch(`${url}/rest/v1/lesson_nodes?select=id,caps_topic_id&id=in.(${inList})`,{headers});
      const nodes:any=await resNodes.json();
      if(Array.isArray(nodes)){
        const capsIds=[...new Set(nodes.map((n:any)=>n.caps_topic_id).filter(Boolean))] as string[];
        if(capsIds.length){
          const capsIn=capsIds.map((id:string)=>`"${id}"`).join(',');
          const resKb=await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,caps_code&id=in.(${capsIn})`,{headers});
          const kbs:any=await resKb.json();
          const kbMap=new Map((kbs||[]).map((k:any)=>[k.id,k.caps_code]));
          const nodeMap=new Map(nodes.map((n:any)=>[n.id,kbMap.get(n.caps_topic_id)]));
          filtered=filtered.map((v:any)=>{ if(!v.caps_code && !v.topic && v.lesson_node_id && nodeMap.get(v.lesson_node_id)){ return {...v, caps_code: nodeMap.get(v.lesson_node_id)}; } return v; });
        }
      }
    }
    setVideos(filtered);
  })();
 },[sid]);

 const hasVideo=(t:any)=>{
  const nTopic=norm(t.id);
  const nTitle=norm(t.title);
  const nUnit=norm(uid);
  if(!videos.length) return false;
  return videos.some(v=>{
    const caps=norm(v.caps_code||"");
    const top=norm(v.topic||"");
    const combined=caps+top;
    if(!combined) return false;
    if(nUnit.includes('doppler') && !combined.includes('doppler')) return false;
    if(nUnit.includes('projectile') && !combined.includes('equationsmotion') && !combined.includes('graphsmotion')) return false;
    if(caps===nTopic || top===nTopic) return true;
    if(combined.includes(nTopic) || nTopic.includes(combined)) return true;
    if(nTitle.includes(caps) && caps.length>4) return true;
    if(nTitle.includes(top) && top.length>4) return true;
    if(nTopic.slice(0,4)===combined.slice(0,4)) return true;
    return false;
  });
 };

 if(!unit) return <div style={{padding:20,color:"#fff"}}>Unit not found</div>;
 return(
  <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
   <div style={{padding:"12px 16px 0",fontSize:13,color:"#6b7280",display:"flex",gap:6}}>
    <Link href="/subjects" style={{color:"#6b7280",textDecoration:"none"}}>Subjects</Link> <span>›</span>
    <Link href={`/subjects/${sid}`} style={{color:"#6b7280",textDecoration:"none"}}>{subj?.name}</Link> <span>›</span>
    <span style={{color:"#e5e7eb"}}>{unit.title}</span>
   </div>
   <h1 style={{fontSize:28,fontWeight:900,padding:"12px 16px"}}>{unit.title}</h1>
   <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:14}}>
    {unit.topics?.map((t:any)=>{
     const tid=`${sid}_${uid}_${t.id}`;
     const show=hasVideo(t);
     return(
      <Link key={t.id} href={`/subjects/${sid}/${uid}/${t.id}`} style={{textDecoration:"none"}}>
       <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:24,padding:"18px 16px"}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:12}}>{t.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
         {show && <div style={{background:"#2a335a",border:"1px solid #3d4a8a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#8ea0ff",fontWeight:700}}>◧ Video Lesson INCLUDED</div>}
         <div style={{background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#9aa0b6"}}>☰ Practice</div>
         <div style={{background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#9aa0b6"}}>⎙ Exam Challenge</div>
         <div style={{background:done.has(tid)?"#0f2a1e":"#1f1f2e",border:"1px solid #252a44",padding:"5px 10px",borderRadius:20,fontSize:12,color:done.has(tid)?"#4ade80":"#6b7280"}}>{done.has(tid)?"✔ Completed":"○ Not started"}</div>
        </div>
       </div>
      </Link>
     )
    })}
   </div>
  </div>
 )
}
