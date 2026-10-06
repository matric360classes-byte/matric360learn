"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function UnitPage(){
  const p = useParams() as any;
  const subjectId = p?.id;
  const unitId = p?.unitId;
  const [topics, setTopics] = useState<any[]>([]);
  const [videosSet, setVideosSet] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let alive = true;
    (async()=>{
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const subjRaw = decodeURIComponent((subjectId||"")+"").toLowerCase().trim();
      const subjNorm = subjRaw.includes('math')? 'mathematics' : subjRaw.includes('physical')? 'physical-sciences' : subjRaw;
      const unitRaw = decodeURIComponent((unitId||"")+"").toLowerCase().trim();

      // 1. FAST TOPICS - exact eq, not ilike, with limit
      try {
        // try exact unit match first - FAST
        let res = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,caps_code,unit&subject=eq.${subjNorm}&unit=eq.${unitRaw}&limit=50`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
        let data:any = await res.json();
        if(!Array.isArray(data) || data.length===0){
          // try caps_code starts with unit first word
          const first = unitRaw.split('-')[0];
          res = await fetch(`${url}/rest/v1/caps_knowledge_base?select=id,topic,caps_code,unit&subject=eq.${subjNorm}&caps_code=like.${first}%&limit=50`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
          data = await res.json();
        }
        if(alive && Array.isArray(data)) setTopics(data);
      } catch {}

      // 2. FAST VIDEOS - only 5 rows, instant
      try {
        const resV = await fetch(`${url}/rest/v1/videos?select=topic&subject=eq.${subjNorm}&limit=100`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
        const vData:any = await resV.json();
        if(alive && Array.isArray(vData)){
          const s = new Set<string>();
          vData.forEach((v:any)=>{ if(v.topic) s.add(v.topic.toLowerCase().trim()); });
          setVideosSet(s);
        }
      } catch {}
      if(alive) setLoading(false);
    })();
    return ()=>{ alive = false; };
  },[subjectId, unitId]);

  const hasVideo = (name:string)=> videosSet.has((name||"").toLowerCase().trim());

  if(loading) return <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#6b7280",padding:20}}>Loading {decodeURIComponent(unitId||"")}...</div>;

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:16,paddingBottom:100}}>
      <Link href={`/subjects/${subjectId}`} style={{color:"#6b7280",fontSize:14,textDecoration:"none"}}>← Back</Link>
      <h1 style={{fontSize:24,fontWeight:900,margin:"12px 0",textTransform:"capitalize"}}>{decodeURIComponent(unitId||"").replace(/-/g," ")}</h1>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {topics.map((t:any)=>{
          const slug = (t.caps_code||t.topic||"").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"-").replace(/--+/g,"-");
          const show = hasVideo(t.topic);
          return(
            <Link key={t.id} href={`/subjects/${subjectId}/${unitId}/${slug}`} style={{textDecoration:"none"}}>
              <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:18,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:"#fff",fontSize:14}}>{t.topic}</div>
                  <div style={{fontSize:10,color:"#6b7280",marginTop:3}}>{t.caps_code}</div>
                </div>
                {show && <span style={{fontSize:8,background:"#00ff88",color:"#000",padding:"5px 8px",borderRadius:20,fontWeight:900,marginLeft:8,whiteSpace:"nowrap"}}>Video INCLUDED</span>}
              </div>
            </Link>
          );
        })}
        {topics.length===0 && <div style={{color:"#6b7280"}}>No topics found for this unit.</div>}
      </div>
    </div>
  );
}
