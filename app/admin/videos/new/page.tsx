"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function ytId(url:string){ const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1]:""; }

export default function VideosListPage(){
  const [videos,setVideos]=useState<any[]>([]);
  const [q,setQ]=useState("");
  const [subject,setSubject]=useState("All subjects");
  const [openMenu,setOpenMenu]=useState(false);

  useEffect(()=>{
    supabase.from("videos").select("*").order("created_at",{ascending:false}).then(({data})=>{
      if(data && data.length>0) setVideos(data);
      else {
        // fallback from topics that already have youtube
        supabase.from("topics").select("id,title,subject,youtube_id,video_url").not("youtube_id","is",null).limit(50).then(({data:t})=>{
          setVideos((t||[]).map((x:any)=>({id:x.id,title:x.title,subject:x.subject,youtube_url:x.video_url||`https://youtu.be/${x.youtube_id}`,youtube_id:x.youtube_id,is_free:false})));
        });
      }
    });
  },[]);

  const filtered = videos.filter(v=>{
    if(q &&!((v.title||"").toLowerCase().includes(q.toLowerCase()) || (v.youtube_url||"").toLowerCase().includes(q.toLowerCase()))) return false;
    if(subject!=="All subjects" && v.subject!==subject) return false;
    return true;
  });

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      {/* Content Admin mode banner */}
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",display:"flex",justifyContent:"space-between"}}>
        <div style={{fontSize:13,lineHeight:1.4}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.</div>
        <button onClick={()=>setOpenMenu(!openMenu)} style={{minWidth:40,minHeight:40,borderRadius:12,background:"#1a1c2e",border:"1px solid #252a44",color:"#fff"}}>☰</button>
      </div>

      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{fontSize:28,fontWeight:900,margin:0}}>Videos</h1>
        <Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#000",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:800,display:"flex",alignItems:"center",gap:6}}>+ Add video</Link>
      </div>

      <div style={{padding:12,display:"grid",gap:10}}>
        <select value={subject} onChange={e=>setSubject(e.target.value)} style={{width:"100%",padding:"14px",borderRadius:14,background:"#151725",border:"1px solid #1e2238",color:"#fff"}}>
          <option>All subjects</option><option>Mathematics</option><option>Physical Sciences</option>
        </select>
        <select style={{width:"100%",padding:"14px",borderRadius:14,background:"#151725",border:"1px solid #1e2238",color:"#6b7280"}}><option>All units</option></select>
        <select style={{width:"100%",padding:"14px",borderRadius:14,background:"#151725",border:"1px solid #1e2238",color:"#6b7280"}}><option>All topics</option></select>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:14,top:14,color:"#6b7280"}}>⌕</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search title/URL" style={{width:"100%",padding:"14px 14px 14px 40px",borderRadius:14,background:"#151725",border:"1px solid #1e2238",color:"#fff"}}/>
        </div>
      </div>

      <div style={{padding:"0 12px",display:"grid",gap:16}}>
        {filtered.map(v=>(
          <div key={v.id} style={{background:"#151725",border:"1px solid #1e2238",borderRadius:24,padding:12}}>
            <div style={{borderRadius:16,overflow:"hidden",background:"#000",aspectRatio:"16/9"}}>
              <img src={`https://img.youtube.com/vi/${v.youtube_id||ytId(v.youtube_url||"")}/hqdefault.jpg`} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
            <div style={{marginTop:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{fontWeight:800,fontSize:18,flex:1}}>{v.title||"Organic compounds, Isomers"}</div>
              <span style={{background:"#2a2110",border:"1px solid #5a3d0a",color:"#ff8c00",fontSize:11,padding:"4px 10px",borderRadius:999,fontWeight:800}}>PREMIUM</span>
            </div>
            <div style={{color:"#9ca3af",fontSize:13,marginTop:4}}>— · youtube · #0</div>
            <div style={{color:"#9ca3af",fontSize:13,wordBreak:"break-all"}}>{v.youtube_url||`https://youtu.be/${v.youtube_id}`}</div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button style={{background:"#102a1a",border:"1px solid #1e4d2b",color:"#00c853",borderRadius:999,padding:"8px 14px",fontSize:12,fontWeight:700}}>Set as Free Preview</button>
              <button style={{width:36,height:36,borderRadius:999,background:"#1a1c2e",border:"1px solid #252a44",color:"#fff"}}>↑</button>
              <button style={{width:36,height:36,borderRadius:999,background:"#1a1c2e",border:"1px solid #252a44",color:"#fff"}}>↓</button>
              <Link href={`/admin/videos/${v.id}/edit`} style={{width:36,height:36,borderRadius:999,background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",display:"grid",placeItems:"center",textDecoration:"none"}}>✎</Link>
              <button onClick={async()=>{if(confirm("Delete?")){await supabase.from("videos").delete().eq("id",v.id); setVideos(videos.filter(x=>x.id!==v.id))}}} style={{width:36,height:36,borderRadius:999,background:"#1a1c2e",border:"1px solid #3a1a1a",color:"#ff4444"}}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
