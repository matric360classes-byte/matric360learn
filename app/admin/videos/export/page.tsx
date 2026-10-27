"use client";
import { useEffect, useState } from "react";

export default function ExportVideos(){
 const [videos,setVideos]=useState<any[]>([]);
 useEffect(()=>{
  (async()=>{
   const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
   const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
   const res=await fetch(`${url}/rest/v1/videos?select=id,title,subject,youtube_url,url,order_index&order=order_index.asc&limit=1000`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
   setVideos(await res.json());
  })();
 },[]);

 const maths = videos.filter(v=> (v.subject||"").toLowerCase().includes("math"));
 const physics = videos.filter(v=> {
   const s=(v.subject||"").toLowerCase(); const t=(v.title||"").toLowerCase();
   return s.includes("physical") || s.includes("physics") || t.includes("physics") || t.includes("mechanic") || t.includes("electric") || t.includes("wave") || t.includes("force") || t.includes("newton") || t.includes("motion");
 });
 const chemistry = videos.filter(v=> {
   const t=(v.title||"").toLowerCase(); const s=(v.subject||"").toLowerCase();
   return !maths.includes(v) && !physics.includes(v) || t.includes("chem") || t.includes("acid") || t.includes("mole") || t.includes("bond") || t.includes("reaction") || s.includes("chem");
 });
 // Fallback grouping if subject is empty, group by title keywords
 const other = videos.filter(v=>!maths.includes(v)&&!physics.includes(v)&&!chemistry.includes(v));

 const copyList = ()=>{
  const text = [
   "MATHEMATICS:",
   ...maths.map((v,i)=>`${i+1}. ${v.title} | ${v.youtube_url||v.url}`),
   "",
   "PHYSICAL SCIENCES - PHYSICS:",
   ...physics.map((v,i)=>`${i+1}. ${v.title} | ${v.youtube_url||v.url}`),
   "",
   "PHYSICAL SCIENCES - CHEMISTRY:",
   ...chemistry.map((v,i)=>`${i+1}. ${v.title} | ${v.youtube_url||v.url}`),
   "",
   "OTHER / UNGROUPED:",
   ...other.map((v,i)=>`${i+1}. ${v.title} | ${v.youtube_url||v.url}`),
  ].join("\n");
  navigator.clipboard.writeText(text);
  alert("Copied "+videos.length+" titles - paste to me");
 };

 return(
  <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:16,fontFamily:"monospace"}}>
   <h1 style={{fontSize:20,fontWeight:900}}>Export {videos.length} Video Titles</h1>
   <button onClick={copyList} style={{background:"#7b7eff",color:"#fff",border:"none",padding:"10px 18px",borderRadius:20,marginTop:10,fontWeight:800}}>Copy List for Allocation</button>
   <div style={{marginTop:16}}>
    <h2>Mathematics ({maths.length})</h2>
    {maths.map(v=><div key={v.id}>• {v.title}</div>)}
    <h2 style={{marginTop:16}}>Physics ({physics.length})</h2>
    {physics.map(v=><div key={v.id}>• {v.title}</div>)}
    <h2 style={{marginTop:16}}>Chemistry ({chemistry.length})</h2>
    {chemistry.map(v=><div key={v.id}>• {v.title}</div>)}
    {other.length>0&&<><h2>Other ({other.length})</h2>{other.map(v=><div key={v.id}>• {v.title}</div>)}</>}
   </div>
  </div>
 )
}
