"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { CURRICULUM } from "@/lib/curriculum";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function VideosAdmin(){
  const [videos,setVideos]=useState<any[]>([]);
  const [showModal,setShowModal]=useState(false);
  const [editingId,setEditingId]=useState<string|null>(null);

  // filters from first screenshot
  const [fSub,setFSub]=useState("All subjects");
  const [fUnit,setFUnit]=useState("All units");
  const [fTopic,setFTopic]=useState("All topics");
  const [search,setSearch]=useState("");

  // form - exactly as second screenshot
  const [url,setUrl]=useState("");
  const [provider,setProvider]=useState("YouTube");
  const [duration,setDuration]=useState("");
  const [subject,setSubject]=useState("");
  const [unit,setUnit]=useState("");
  const [topic,setTopic]=useState("");
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [thumb,setThumb]=useState("");
  const [order,setOrder]=useState("0");
  const [status,setStatus]=useState("Ready");
  const [saving,setSaving]=useState(false);

  const ytId = useMemo(()=>url.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1]||"",[url]);
  const units = useMemo(()=> subject? Object.keys(CURRICULUM[subject]||{}): [],[subject]);
  const topics = useMemo(()=> subject && unit? CURRICULUM[subject][unit]: [],[subject,unit]);

  useEffect(()=>{ if(ytId &&!thumb) setThumb(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`); },[ytId]);

  const load = async ()=>{
    const { data } = await supabase.from("videos").select("*").order("order_index");
    if(data) setVideos(data);
  };
  useEffect(()=>{ load(); },[]);

  const openAdd = ()=>{ setEditingId(null); setUrl(""); setProvider("YouTube"); setDuration(""); setSubject(""); setUnit(""); setTopic(""); setTitle(""); setDescription(""); setThumb(""); setOrder("0"); setStatus("Ready"); setShowModal(true); };
  const openEdit = (v:any)=>{ setEditingId(v.id); setUrl(v.youtube_url); setSubject(v.subject==="physical-sciences"?"Physical Sciences":"Mathematics"); setUnit(v.caps_code); setTopic(v.topic); setTitle(v.title); setDescription(v.description||""); setThumb(v.thumbnail_url); setOrder(String(v.order_index||0)); setStatus(v.status); setShowModal(true); };

  const save = async ()=>{
    if(!subject||!unit||!topic||!title||!url){ alert("Fill Subject, Unit, Topic, Title, URL"); return; }
    setSaving(true);
    const payload:any = { youtube_url:url, youtube_id:ytId, subject:subject.toLowerCase().replace(/\s+/g,"-"), caps_code:unit, topic, title, description:description||null, thumbnail_url:thumb||`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`, order_index:parseInt(order)||0, status, is_premium:false };
    const { error } = editingId? await supabase.from("videos").update(payload).eq("id",editingId) : await supabase.from("videos").insert(payload);
    setSaving(false);
    if(error) alert(error.message); else { setShowModal(false); load(); }
  };

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", paddingBottom:80}}>
      {/* list UI - first screenshot */}
      <div style={{padding:12, display:"flex", justifyContent:"space-between"}}><h1 style={{fontWeight:800}}>Videos</h1><button onClick={openAdd} style={{background:"#818cf8", color:"black", padding:"8px 16px", borderRadius:20, fontWeight:700}}>+ Add video</button></div>
      <div style={{padding:"0 12px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
        <select value={fSub} onChange={e=>setFSub(e.target.value)} style={{background:"#15151f", padding:10, borderRadius:10, border:"1px solid #222", color:"white"}}><option>All subjects</option><option>Mathematics</option><option>Physical Sciences</option></select>
        <select value={fUnit} onChange={e=>setFUnit(e.target.value)} style={{background:"#15151f", padding:10, borderRadius:10, border:"1px solid #222", color:"white"}}><option>All units</option>{Object.keys(CURRICULUM["Physical Sciences"]).map((u:string)=><option key={u}>{u}</option>)}</select>
        <select value={fTopic} onChange={e=>setFTopic(e.target.value)} style={{background:"#15151f", padding:10, borderRadius:10, border:"1px solid #222", color:"white"}}><option>All topics</option></select>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title/URL" style={{background:"#15151f", padding:10, borderRadius:10, border:"1px solid #222", color:"white"}}/>
      </div>
      <div style={{padding:12, display:"flex", flexDirection:"column", gap:12}}>
        {videos.map((v:any)=><div key={v.id} style={{background:"#16161f", borderRadius:16, padding:10, display:"flex", gap:10, border:"1px solid #222"}}><img src={v.thumbnail_url} style={{width:100, height:60, borderRadius:10}}/><div style={{flex:1}}><p style={{fontSize:13, fontWeight:600}}>{v.title}</p><p style={{fontSize:11, color:"#6b7280"}}>{v.youtube_url}</p></div><button onClick={()=>openEdit(v)} style={{fontSize:12}}>✏️</button><button onClick={async()=>{ if(confirm("Delete?")){ await supabase.from("videos").delete().eq("id",v.id); load(); } }} style={{fontSize:12, color:"#ef4444"}}>🗑️</button></div>)}
      </div>

      {/* modal - second screenshot - EXACT fields */}
      {showModal && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, zIndex:100}}>
          <div style={{background:"#1e1e2a", width:"100%", maxWidth:480, borderRadius:20, padding:16, border:"1px solid #2a2a3a", maxHeight:"90vh", overflowY:"auto"}}>
            <h2 style={{fontWeight:800}}>Add video</h2>
            <p style={{fontSize:13, marginTop:12}}>Video URL (YouTube or Bunny Stream)</p>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://..." style={{width:"100%", marginTop:6, padding:12, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}/>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12}}>
              <div><p style={{fontSize:13}}>Provider</p><select value={provider} onChange={e=>setProvider(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}><option>YouTube</option><option>Bunny</option></select></div>
              <div><p style={{fontSize:13}}>Duration (sec)</p><input value={duration} onChange={e=>setDuration(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}/></div>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:12}}>
              <select value={subject} onChange={e=>{setSubject(e.target.value); setUnit(""); setTopic("");}} style={{padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}><option value="">Subject...</option>{Object.keys(CURRICULUM).map((s:string)=><option key={s} value={s}>{s}</option>)}</select>
              <select value={unit} onChange={e=>{setUnit(e.target.value); setTopic("");}} style={{padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}><option value="">Unit... ({units.length})</option>{units.map((u:string)=><option key={u} value={u}>{u}</option>)}</select>
              <select value={topic} onChange={e=>setTopic(e.target.value)} style={{padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}><option value="">Topic... ({topics.length})</option>{topics.map((t:string)=><option key={t} value={t}>{t}</option>)}</select>
            </div>

            <p style={{fontSize:13, marginTop:12}}>Title</p><input value={title} onChange={e=>setTitle(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}/>
            <p style={{fontSize:13, marginTop:12}}>Description</p><textarea value={description} onChange={e=>setDescription(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white", minHeight:60}}/>
            <p style={{fontSize:13, marginTop:12}}>Thumbnail URL</p><input value={thumb} onChange={e=>setThumb(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}/>
            {ytId && <div style={{marginTop:8}}><img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} style={{width:"100%", height:120, objectFit:"cover", borderRadius:12}}/><p style={{fontSize:11, color:"#9ca3af", marginTop:4}}>Preview: https://youtu.be/{ytId}</p></div>}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12}}>
              <div><p style={{fontSize:13}}>Order</p><input value={order} onChange={e=>setOrder(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}/></div>
              <div><p style={{fontSize:13}}>Status</p><select value={status} onChange={e=>setStatus(e.target.value)} style={{width:"100%", marginTop:4, padding:10, borderRadius:12, background:"#11111a", border:"1px solid #2a2a3a", color:"white"}}><option>Ready</option><option>Draft</option></select></div>
            </div>
            <div style={{display:"flex", justifyContent:"flex-end", gap:8, marginTop:16}}><button onClick={()=>setShowModal(false)} style={{padding:"10px 18px", borderRadius:20, background:"#2a2a3a", color:"white"}}>Cancel</button><button onClick={save} disabled={saving} style={{padding:"10px 18px", borderRadius:20, background:"#818cf8", color:"black", fontWeight:800}}>{saving?"Saving...":"Save"}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
