"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function VideosPage(){
  const [videos,setVideos]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ (async()=>{
    const {data} = await supabase.from("videos").select("*").order("created_at",{ascending:false}).limit(100);
    if(data) setVideos(data);
    setLoading(false);
  })() },[]);

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:30}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{color:"#00ff88",fontWeight:800}}>🎬 Videos • {videos.length}</span>
        <Link href="/admin" style={{color:"#9aa0b3",fontSize:12,textDecoration:"none"}}>← Admin</Link>
      </div>
      <div style={{margin:"0 12px",background:"#151725",border:"1px solid #1e2238",borderRadius:24,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h2 style={{fontSize:20,fontWeight:900,margin:0}}>All Videos</h2>
          <Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#000",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:800,fontSize:13}}>+ Add Video</Link>
        </div>
        {loading? <div style={{color:"#888"}}>Loading...</div> : videos.length===0? <div style={{color:"#888",padding:20,textAlign:"center"}}>No videos yet. Click + Add Video</div> : 
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {videos.map(v=>(
            <div key={v.id} style={{background:"#0e0f1a",border:"1px solid #1e2238",borderRadius:14,padding:12,display:"flex",gap:12,alignItems:"center"}}>
              <img src={v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/0.jpg`} style={{width:80,height:45,borderRadius:8,objectFit:"cover",background:"#000"}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.title || v.youtube_id || "Untitled"}</div>
                <div style={{fontSize:11,color:"#9aa0b3"}}>{v.subject} • {v.topic} • {v.youtube_id}</div>
              </div>
              <Link href={`/admin/videos/${v.id}/edit`} style={{background:"#1a1c2e",border:"1px solid #252a44",padding:"6px 12px",borderRadius:999,color:"#fff",textDecoration:"none",fontSize:12}}>✎ Edit</Link>
            </div>
          ))}
        </div>
        }
      </div>
    </div>
  )
}
