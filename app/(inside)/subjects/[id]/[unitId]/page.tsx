"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SUBJECTS_DATA } from "../../../../../lib/subjects";

const norm = (s:string)=> (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");

export default function UnitPage(){
 const p=useParams() as any;
 let sid=p.id as string; if(sid==="physical-science") sid="physical-sciences";
 const uid=p.unitId as string;
 const subj=(SUBJECTS_DATA as any)[sid];
 const unit = subj?.sections?.flatMap((s:any)=>s.units).find((u:any)=>u.id===uid);
 const [done,setDone]=useState<Set<string>>(new Set());
 const [videos,setVideos]=useState<any[]>([]);

 useEffect(()=>{
  try{
   const saved = localStorage.getItem("matric360_progress");
   if(saved) setDone(new Set(JSON.parse(saved)));
  }catch{}
 },[]);

 useEffect(()=>{
  (async()=>{
    try{
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const subjNorm = sid.toLowerCase().includes('math')? 'mathematics' : 'physical-sciences';
      
      // FAST: 1 fetch only, subject filtered - fixes maths in physics
      const res = await fetch(`${url}/rest/v1/videos?select=caps_code,topic,subject&subject=eq.${subjNorm}&limit=500`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const data:any = await res.json();
      if(Array.isArray(data)) setVideos(data);
      else setVideos([]);
    }catch{ setVideos([]); }
  })();
 },[sid]);

 const getScore = (a:string,b:string)=>{
   if(!a||!b) return 0;
   a=norm(a); b=norm(b);
   if(!a||!b) return 0;
   if(a===b) return 100;
   if(b.includes(a) || a.includes(b)) return 85;
   if(a.length>4 && b.length>4 && (a.includes(b.slice(0,4)) || b.includes(a.slice(0,4)))) return 60;
   return 0;
 };

 const hasVideo = (t:any)=>{
  if(!videos.length) return false;
  const tid = t.id || "";
  const ttitle = t.title || "";
  // Unit relevance: video must share at least unit word OR be exact topic
  const unitWords = uid.toLowerCase().split('-').filter((w:string)=>w.length>3);
  
  for(const v of videos){
    const vc = v.caps_code || "";
    const vt = v.topic || "";
    const s1 = getScore(tid, vc);
    const s2 = getScore(tid, vt);
    const s3 = getScore(ttitle, vc);
    const s4 = getScore(ttitle, vt);
    const best = Math.max(s1,s2,s3,s4);
    if(best >= 60){
      // Extra unit check for physics to prevent doppler showing in chemical equilibrium
      if(uid.includes('chemical') && (vc.toLowerCase().includes('doppler') || vc.toLowerCase().includes('projectile'))) continue;
      return true;
    }
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
   <div style={{padding:"12px 16px 0",fontSize:11,color:"#6b7280",letterSpacing:1.2}}>UNIT</div>
   <h1 style={{fontSize:28,fontWeight:900,padding:"2px 16px 18px",lineHeight:"1.15"}}>{unit.title}</h1>

   <div style={{padding:"0 12px",display:"flex",flexDirection:"column",gap:14}}>
    {unit.topics?.map((t:any)=>{
     const tid = `${sid}_${uid}_${t.id}`;
     const isDone = done.has(tid);
     const show = hasVideo(t);
     return(
      <Link key={t.id} href={`/subjects/${sid}/${uid}/${t.id}`} style={{textDecoration:"none"}}>
       <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:24,padding:"18px 16px"}}>
        <div style={{fontSize:18,fontWeight:800,color:"#fff",marginBottom:12}}>{t.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
         {show && (
           <div style={{display:"flex",alignItems:"center",gap:6,background:"#2a335a",border:"1px solid #3d4a8a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#8ea0ff",fontWeight:700}}>
             <span style={{fontSize:12}}>◧</span> Video Lesson <span style={{background:"#3d4a8a",padding:"2px 7px",borderRadius:8,fontSize:10,color:"#aab6ff",fontWeight:800,letterSpacing:0.5}}>INCLUDED</span>
           </div>
         )}
         <div style={{display:"flex",alignItems:"center",gap:5,background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#9aa0b6"}}>☰ Practice</div>
         <div style={{display:"flex",alignItems:"center",gap:5,background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#9aa0b6"}}>⎙ Exam Challenge</div>
         {isDone? (
          <div style={{display:"flex",gap:5,background:"#0f2a1e",border:"1px solid #14532d",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#4ade80",fontWeight:700}}>✔ Completed</div>
         ) : (
          <div style={{display:"flex",gap:5,background:"#1f1f2e",border:"1px solid #2a2d4a",padding:"5px 10px",borderRadius:20,fontSize:12,color:"#6b7280"}}>○ Not started</div>
         )}
        </div>
       </div>
      </Link>
     )
    })}
   </div>
  </div>
 )
}
