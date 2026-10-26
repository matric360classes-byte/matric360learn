"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SUBJECTS_DATA } from "../../../../../lib/subjects";

const norm = (s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9]/g," ").trim();
const words = (s:string)=> norm(s).split(/\s+/).filter(w=>w.length>2);

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
    try{
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const subjNorm = sid.toLowerCase().includes('math')? 'mathematics' : 'physical-sciences';
      const res = await fetch(`${url}/rest/v1/videos?select=caps_code,topic,subject&subject=eq.${subjNorm}&limit=500`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const data:any = await res.json();
      if(Array.isArray(data)) setVideos(data);
    }catch{}
  })();
 },[sid]);

 const score = (a:string,b:string)=>{
   if(!a||!b) return 0;
   const an=norm(a), bn=norm(b);
   if(an===bn) return 100;
   if(bn.includes(an) || an.includes(bn)) return 80;
   const aw=words(a), bw=words(b);
   let common=0; aw.forEach(w=>{ if(bw.includes(w) || bw.some(x=>x.includes(w) && w.length>3)) common++; });
   if(common===0) return 0;
   return Math.round((common / Math.max(aw.length,bw.length))*75);
 };

 const hasVideo = (t:any)=>{
  if(!videos.length) return false;
  const tid=t.id||"", ttitle=t.title||"";
  // Unit relevance first
  const unitW = uid.toLowerCase().split('-');
  for(const v of videos){
    const vc=v.caps_code||"", vt=v.topic||"";
    let unitScore=0;
    unitW.forEach(uw=>{ if(vc.toLowerCase().includes(uw) || vt.toLowerCase().includes(uw)) unitScore+=10; });
    // If unit is chemical, don't allow doppler/projectile to give badge
    if(uid.includes('chemical') && (vc.toLowerCase().includes('doppler') || vc.toLowerCase().includes('projectile'))) continue;

    const best = Math.max(score(tid,vc), score(tid,vt), score(ttitle,vc), score(ttitle,vt));
    if(best + unitScore >= 40) return true;
  }
  return false;
 };

 if(!unit) return <div style={{padding:20,color:"#fff"}}>Unit not found</div>;
 return(
  <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",paddingBottom:100}}>
   <div style={{padding:"12px 16px 0",fontSize:13,color:"#6b7280",display:"flex",gap:6}}>
    <Link href="/subjects" style={{color:"#6b7280",textDecoration:"none"}}>Subjects</Link> <span>›</span>
    <Link href={`/subjects/${sid}`} style={{color:"#6b7280",textDecoration:"none"}}>{subj?.name}</Link> <span>›</span>
    <span style={{color:"#e5e7eb"}}>{unit.title}</span>
   </div>
   <h1 style={{fontSize:28,fontWeight:900,padding:"2px 16px 18px"}}>{unit.title}</h1>
   <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:14}}>
    {unit.topics?.map((t:any)=>{
     const show = hasVideo(t);
     const tid = `${sid}_${uid}_${t.id}`;
     return(
      <Link key={t.id} href={`/subjects/${sid}/${uid}/${t.id}`} style={{textDecoration:"none"}}>
       <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:24,padding:"18px 16px"}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:12}}>{t.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
         {show && <div style={{display:"flex",gap:6,background:"#2a335a",border:"1px solid #3d4a8a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#8ea0ff",fontWeight:700}}>◧ Video Lesson <span style={{background:"#3d4a8a",padding:"2px 7px",borderRadius:8,fontSize:10}}>INCLUDED</span></div>}
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
