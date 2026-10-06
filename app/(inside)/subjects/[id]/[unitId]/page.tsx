"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function UnitPage(){
  const p = useParams() as any;
  const subjectId = p?.id;
  const unitId = p?.unitId;
  const [topics, setTopics] = useState<any[]>([]);
  const [videosMap, setVideosMap] = useState<Record<string, boolean>>({});

  useEffect(()=>{(async()=>{
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const subjRaw = decodeURIComponent(subjectId||"").toLowerCase().trim();
    const subjNorm = subjRaw.includes('math')? 'mathematics' : subjRaw.includes('physical')? 'physical-sciences' : subjRaw;
    const unitRaw = decodeURIComponent(unitId||"").toLowerCase().trim();

    // Fetch topics for this unit from caps_knowledge_base
    const resKb = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,caps_code,unit&subject=eq.${subjNorm}&unit=ilike.%${unitRaw.split('-')[0]}%`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    let kb:any = await resKb.json();
    if(!Array.isArray(kb) || kb.length===0){
      // fallback: try all for subject
      const resAll = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,caps_code,unit&subject=eq.${subjNorm}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      kb = await resAll.json();
    }
    if(Array.isArray(kb)) setTopics(kb);

    // FETCH VIDEOS - BUILD MAP FOR BADGE
    try {
      const resVid = await fetch(`${url}/rest/v1/videos?select=topic,subject&subject=eq.${subjNorm}`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const allVids:any = await resVid.json();
      if(Array.isArray(allVids)){
        const map:Record<string,boolean> = {};
        allVids.forEach((v:any)=>{
          const vt = (v.topic||"").toLowerCase().trim();
          if(vt) map[vt] = true;
        });
        setVideosMap(map);
      }
    } catch(e){}

  })()},[subjectId, unitId]);

  const hasVideo = (topicName:string)=>{
    const lower = (topicName||"").toLowerCase().trim();
    return!!videosMap[lower] || Object.keys(videosMap).some(k => lower.includes(k) || k.includes(lower));
  };

  const cleanUnit = decodeURIComponent(unitId||"").replace(/-/g," ");

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:"16px",paddingBottom:100}}>
      <Link href={`/subjects/${subjectId}`} style={{color:"#6b7280",fontSize:"14px",textDecoration:"none"}}>← Back</Link>
      <h1 style={{fontSize:"24px",fontWeight:900,margin:"12px 0",textTransform:"capitalize"}}>{cleanUnit}</h1>

      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        {topics.map((t:any)=>{
          const topicSlug = (t.caps_code || t.topic||"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
          const showBadge = hasVideo(t.topic);
          return(
            <Link key={t.id} href={`/subjects/${subjectId}/${unitId}/${topicSlug}`} style={{textDecoration:"none"}}>
              <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:"20px",padding:"16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontWeight:700,color:"#fff",textTransform:"capitalize"}}>{t.topic}</div>
                  <div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>{t.caps_code}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px"}}>
                  {/* ONLY SHOW IF VIDEO EXISTS - NOT HARDCODED */}
                  {showBadge && (
                    <span style={{fontSize:"9px",background:"#00ff88",color:"#000",padding:"4px 8px",borderRadius:"20px",fontWeight:800}}>
                      Video Lesson INCLUDED
                    </span>
                  )}
                  <span style={{fontSize:"10px",color:"#6b7280"}}>View →</span>
                </div>
              </div>
            </Link>
          )
        })}
        {topics.length===0 && <div style={{color:"#6b7280",marginTop:"20px"}}>Loading topics...</div>}
      </div>
    </div>
  )
}
