"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VideosListPage(){
  const [videos,setVideos]=useState<any[]>([]);
  const [filterSubj,setFilterSubj]=useState("All");
  const [search,setSearch]=useState("");

  const load=async()=>{ const r=await fetch("/api/admin/videos"); const d=await r.json(); setVideos(Array.isArray(d)?d:[]); };
  useEffect(()=>{ load(); },[]);

  const togglePremium=async(v:any)=>{
    await fetch("/api/admin/videos",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:v.id,caps_topic_id:v.caps_topic_id,is_premium:!v.is_premium})});
    load();
  };

  const del=async(id:string)=>{ if(!confirm("Delete?")) return; await fetch(`/api/admin/videos?id=${id}`,{method:"DELETE"}); load(); };

  const filtered=videos.filter(v=>{
    if(filterSubj!=="All" &&!(v.subject||"").toLowerCase().includes(filterSubj.toLowerCase().slice(0,4))) return false;
    if(search &&!(`${v.title} ${v.youtube_url}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",fontSize:13}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank.</div>

      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h1 style={{fontSize:26,fontWeight:900}}>Videos</h1>
        <Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link>
      </div>

      <div style={{padding:"12px 16px",display:"grid",gap:8}}>
        <select value={filterSubj} onChange={e=>setFilterSubj(e.target.value)} style={{background:"#1a1c2e",border:"1px solid #2a2d4a",borderRadius:14,padding:"14px",color:"#fff"}}>
          <option value="All">All subjects</option><option value="mathematics">Mathematics</option><option value="physical-sciences">Physical Sciences</option>
        </select>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title/URL" style={{background:"#1a1c2e",border:"1px solid #2a2d4a",borderRadius:14,padding:"14px",color:"#fff"}}/>
      </div>

      <div style={{padding:"0 16px",display:"grid",gap:16}}>
        {filtered.map(v=>(
          <div key={v.id} style={{background:"#1c1e2e",borderRadius:24,padding:12,border:"1px solid #252a44"}}>
            <div style={{borderRadius:16,overflow:"hidden",background:"#000"}}><img src={v.thumbnail_url||`https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`} style={{width:"100%",height:200,objectFit:"cover",display:"block"}}/></div>
            <div style={{marginTop:10,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div style={{fontWeight:800,fontSize:16}}>{v.title}</div>
              <span style={{fontSize:11,padding:"4px 10px",borderRadius:999,border:"1px solid",borderColor: v.is_premium?"#ff8c00":"#00ff88",color: v.is_premium?"#ff8c00":"#00ff88"}}>{v.is_premium?"PREMIUM":"FREE PREVIEW"}</span>
            </div>
            <div style={{fontSize:12,color:"#aaa",marginTop:4}}>— · youtube · #{v.order_index||0}<br/>{v.youtube_url}</div>
            <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
              <button onClick={()=>togglePremium(v)} style={{background: v.is_premium?"#123":"#252a44",color: v.is_premium?"#00ff88":"#fff",border:"1px solid #2a2d4a",padding:"8px 14px",borderRadius:999,fontWeight:700}}>{v.is_premium?"Set as Free Preview":"Make Premium"}</button>
              <button style={{background:"#252a44",border:"none",color:"#fff",width:36,height:36,borderRadius:999}}>↑</button>
              <button style={{background:"#252a44",border:"none",color:"#fff",width:36,height:36,borderRadius:999}}>↓</button>
              <Link href={`/admin/videos/edit/${v.id}`} style={{background:"#252a44",color:"#fff",width:36,height:36,borderRadius:999,display:"grid",placeItems:"center",textDecoration:"none"}}>✎</Link>
              <button onClick={()=>del(v.id)} style={{background:"#2a1a1a",border:"1px solid #4a2020",color:"#ff5555",width:36,height:36,borderRadius:999}}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
