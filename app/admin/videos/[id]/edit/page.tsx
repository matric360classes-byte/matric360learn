"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getId(url:string){ const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1]:""; }

export default function EditVideoPage(){
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [url,setUrl]=useState("");
  const [provider,setProvider]=useState("YouTube");
  const [duration,setDuration]=useState("");
  const [subject,setSubject]=useState("");
  const [unit,setUnit]=useState("");
  const [topic,setTopic]=useState("");
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [thumb,setThumb]=useState("");
  const [order,setOrder]=useState("0");
  const [status,setStatus]=useState("Ready");

  useEffect(()=>{
    supabase.from("videos").select("*").eq("id",id).single().then(({data})=>{
      if(data){
        setUrl(data.youtube_url); setProvider(data.provider==="youtube"?"YouTube":"Bunny Stream");
        setDuration(String(data.duration_sec||"")); setSubject(data.subject||"");
        setUnit(data.unit||""); setTopic(data.topic||""); setTitle(data.title||"");
        setDesc(data.description||""); setThumb(data.thumbnail_url||"");
        setOrder(String(data.order_num||0)); setStatus(data.status==="ready"?"Ready":"Draft");
      }
    });
  },[id]);

  const save=async()=>{
    const yid=getId(url);
    const { error } = await supabase.from("videos").update({
      youtube_url:url, youtube_id:yid, provider:provider.toLowerCase(),
      duration_sec: duration? parseInt(duration): null,
      subject, unit, topic, title, description:desc,
      thumbnail_url:thumb, order_num: parseInt(order)||0, status: status.toLowerCase()
    }).eq("id",id);
    if(error){ alert(error.message); return; }
    router.push("/admin/videos");
  };

  const inputStyle={width:"100%",padding:"14px",borderRadius:14,background:"#151725",border:"1px solid #1e2238",color:"#fff"} as any;
  const labelStyle={fontSize:14,fontWeight:700,marginBottom:6,display:"block"} as any;

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:30}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px"}}><span style={{color:"#00ff88",fontWeight:800}}>Edit Video</span></div>
      <div style={{margin:"0 12px",background:"#151725",border:"1px solid #1e2238",borderRadius:24,padding:16}}>
        <h2 style={{fontSize:24,fontWeight:900,margin:"0 0 16px"}}>Edit video</h2>
        <label style={labelStyle}>Video URL (YouTube or Bunny Stream)</label><input value={url} onChange={e=>setUrl(e.target.value)} style={inputStyle}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:14}}>
          <div><label style={labelStyle}>Provider</label><select value={provider} onChange={e=>setProvider(e.target.value)} style={inputStyle}><option>YouTube</option><option>Bunny Stream</option></select></div>
          <div><label style={labelStyle}>Duration (sec)</label><input value={duration} onChange={e=>setDuration(e.target.value)} style={inputStyle}/></div>
        </div>
        <label style={{...labelStyle,marginTop:14}}>Title</label><input value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle}/>
        <label style={{...labelStyle,marginTop:14}}>Description</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} style={{...inputStyle,height:90}}/>
        <label style={{...labelStyle,marginTop:14}}>Thumbnail URL</label><input value={thumb} onChange={e=>setThumb(e.target.value)} style={inputStyle}/>
        {thumb && <img src={thumb} style={{width:"100%",height:160,objectFit:"cover",borderRadius:12,marginTop:8}}/>}
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:18}}>
          <button onClick={()=>router.back()} style={{padding:"10px 18px",borderRadius:999,background:"#1a1c2e",border:"1px solid #252a44",color:"#fff"}}>Cancel</button>
          <button onClick={save} style={{padding:"10px 22px",borderRadius:999,background:"#8b8bff",border:0,color:"#000",fontWeight:800}}>Update</button>
        </div>
      </div>
    </div>
  )
}
