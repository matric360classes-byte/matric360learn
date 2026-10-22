"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function VideosAdmin(){
  const [videos,setVideos]=useState<any[]>([]);
  const [kb,setKb]=useState<any[]>([]);
  const [nodes,setNodes]=useState<any[]>([]);
  const [showModal,setShowModal]=useState(false);
  const [editingId,setEditingId]=useState<string|null>(null);

  const [fSub,setFSub]=useState("All subjects");
  const [search,setSearch]=useState("");

  const [url,setUrl]=useState("");
  const [subject,setSubject]=useState("mathematics");
  const [unit,setUnit]=useState("");
  const [topic,setTopic]=useState("");
  const [title,setTitle]=useState("");
  const [thumb,setThumb]=useState("");
  const [order,setOrder]=useState("0");
  const [status,setStatus]=useState("Ready");
  const [saving,setSaving]=useState(false);

  const ytId = useMemo(()=>url.match(/(?:youtu\.be\/|v=)([^&?]+)/)?.[1]||"",[url]);

  // LOAD TRUTH - caps_kb = Units for Student App, lesson_nodes = your 675 Nodes
  useEffect(()=>{
    const load = async ()=>{
      const { data: kbData } = await supabase.from("caps_kb").select("*").order("caps_code");
      if(kbData) setKb(kbData);
      const { data: nodeData } = await supabase.from("lesson_nodes").select("id, title, caps_topic_id, topic_slug").limit(1000);
      if(nodeData) setNodes(nodeData);
      const { data: vidData } = await supabase.from("videos").select("*").order("created_at", {ascending:false}).limit(100);
      if(vidData) setVideos(vidData);
    };
    load();
  },[]);

  // Units from caps_kb (same as Student App) - NOT from lib/curriculum.ts
  const units = useMemo(()=>{
    const filtered = subject ? kb.filter(k=> k.subject?.toLowerCase().includes(subject.toLowerCase())) : kb;
    return [...new Set(filtered.map(k=>k.caps_code))].sort();
  },[subject, kb]);

  const topics = useMemo(()=>{
    if(!unit) return [];
    return kb.filter(k=> k.caps_code===unit).map(k=> ({ name: k.topic || k.title, id: k.id, caps_topic_id: k.id }));
  },[unit, kb]);

  useEffect(()=>{ if(ytId &&!thumb) setThumb(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`); },[ytId]);

  const save = async ()=>{
    if(!subject||!unit||!topic||!title||!url){ alert("Fill Subject, Unit, Topic, Title, URL"); return; }
    setSaving(true);
    const selectedKb = kb.find(k=> k.caps_code===unit && (k.topic===topic || k.title===topic));
    const matchedNode = nodes.find(n=> n.caps_topic_id===selectedKb?.id || n.title?.toLowerCase()===topic.toLowerCase());
    
    const payload:any = {
      youtube_url:url,
      youtube_id:ytId,
      subject,
      caps_code:unit, // e.g., "Unit 4: Functions" - matches your screenshot
      caps_topic_id: selectedKb?.id || matchedNode?.caps_topic_id,
      topic, // e.g., "Transformation of functions"
      title,
      thumbnail_url:thumb,
      order_index:parseInt(order)||0,
      status,
      is_premium:false,
      lesson_node_id: matchedNode?.id || null // links directly to your 675 Nodes -> makes INCLUDED show
    };
    const { error } = editingId ? await supabase.from("videos").update(payload).eq("id",editingId) : await supabase.from("videos").insert(payload);
    setSaving(false);
    if(error) alert(error.message); else { setShowModal(false); window.location.reload(); }
  };

  return(
    <div style={{background:"#0a0a12", minHeight:"100vh", color:"white", padding:12}}>
      <div style={{display:"flex", justifyContent:"space-between"}}><h1 style={{fontWeight:800}}>Videos (Linked to {nodes.length} Nodes)</h1><button onClick={()=>setShowModal(true)} style={{background:"#818cf8", padding:"8px 16px", borderRadius:20, color:"black", fontWeight:700}}>+ Add video</button></div>
      
      <div style={{marginTop:12, display:"flex", flexDirection:"column", gap:8}}>
        {videos.slice(0,20).map(v=><div key={v.id} style={{background:"#16161f", padding:10, borderRadius:12, display:"flex", gap:10, border:"1px solid #222"}}>
          <img src={v.thumbnail_url} style={{width:80, height:45, borderRadius:8}}/>
          <div style={{flex:1}}><p style={{fontSize:13, fontWeight:600}}>{v.title} - {v.topic}</p><p style={{fontSize:11, color:"#9ca3af"}}>{v.caps_code} • {v.lesson_node_id ? "✅ Linked to Node" : "⚠️ Not linked"}</p></div>
        </div>)}
      </div>

      {showModal && (
        <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.8)", display:"flex", justifyContent:"center", alignItems:"center", padding:16, zIndex:99}}>
          <div style={{background:"#1e1e2a", width:"100%", maxWidth:480, borderRadius:20, padding:16, maxHeight:"90vh", overflowY:"auto"}}>
            <h2 style={{fontWeight:800}}>Add video - Uses caps_kb (same as Student)</h2>
            <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://youtu.be/..." style={{width:"100%", marginTop:12, padding:12, borderRadius:12, background:"#11111a", color:"white", border:"1px solid #333"}}/>
            <select value={subject} onChange={e=>{setSubject(e.target.value); setUnit("");}} style={{width:"100%", marginTop:8, padding:10, borderRadius:12, background:"#11111a", color:"white"}}>
              <option value="mathematics">Mathematics</option>
              <option value="physical-sciences">Physical Sciences</option>
            </select>
            <select value={unit} onChange={e=>setUnit(e.target.value)} style={{width:"100%", marginTop:8, padding:10, borderRadius:12, background:"#11111a", color:"white"}}>
              <option value="">Unit... ({units.length} found from caps_kb)</option>
              {units.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
            <select value={topic} onChange={e=>setTopic(e.target.value)} style={{width:"100%", marginTop:8, padding:10, borderRadius:12, background:"#11111a", color:"white"}}>
              <option value="">Topic... ({topics.length})</option>
              {topics.map(t=><option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Video Title (e.g., Inverse Functions)" style={{width:"100%", marginTop:12, padding:10, borderRadius:12, background:"#11111a", color:"white"}}/>
            <div style={{display:"flex", gap:8, marginTop:16}}><button onClick={()=>setShowModal(false)} style={{flex:1, padding:10, borderRadius:20, background:"#2a2a3a", color:"white"}}>Cancel</button><button onClick={save} style={{flex:1, padding:10, borderRadius:20, background:"#818cf8", color:"black", fontWeight:800}}>{saving?"Saving...":"Save & Link to Node"}</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
