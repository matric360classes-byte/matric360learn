"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function getYoutubeId(url:string){ if(!url) return ""; const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1]:url; }

export default function Page(){
  const p = useParams() as any;
  const subjectId=p?.id, unitId=p?.unitId, topicId=p?.topicId;
  const [videos, setVideos] = useState<any[]>([]);
  const [debug, setDebug] = useState("loading...");

  useEffect(()=>{(async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    try {
      const res = await fetch(`${url}/rest/v1/videos?select=*&limit=10`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const data = await res.json();
      if(!Array.isArray(data)) { setDebug("NOT ARRAY: "+JSON.stringify(data).slice(0,500)); return; }
      setDebug(`FOUND ${data.length} videos - RLS OK`);
      setVideos(data);
    } catch(e:any){ setDebug("ERROR: "+e.message); }
  })()},[]);

  const ytId = videos[0] ? (videos[0].youtube_id || getYoutubeId(videos[0].youtube_url||videos[0].video_url||"")) : "";

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:16}}>
      <Link href={`/subjects/${subjectId}/${unitId}`} style={{color:"#6b7280"}}>← Back</Link>
      <h1 style={{marginTop:10}}>DEBUG: {decodeURIComponent(topicId||"")}</h1>
      <div style={{background:"#222",padding:12,borderRadius:8,margin:"12px 0",fontSize:12}}>Status: {debug}</div>
      <div style={{fontSize:12}}>Raw first video: {JSON.stringify(videos[0]||{}).slice(0,500)}</div>
      
      {ytId ? (
        <div style={{marginTop:16, background:"#000", borderRadius:16, overflow:"hidden", aspectRatio:"16/9"}}>
          <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${ytId}`} allowFullScreen />
        </div>
      ) : <div style={{marginTop:20,color:"#ff6b35"}}>No youtube_id found - check raw above</div>}

      <div style={{marginTop:20}}>
        {videos.map((v:any)=><div key={v.id} style={{border:"1px solid #333",padding:8,margin:4,borderRadius:8,fontSize:11}}>{v.id} | caps_code: {v.caps_code} | topic: {v.topic} | yt: {v.youtube_id || v.youtube_url}</div>)}
      </div>
    </div>
  )
}
