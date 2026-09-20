"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// FIXED: Exact 11-char extractor
function getYoutubeId(url:string){
  const m = url.trim().match(/(?:youtu\.be\/|v=|embed\/|shorts\/|vi\/)([a-zA-Z0-9_-]{11})/);
  return m? m[1] : "";
}

export default function NewVideoPage(){
  const router = useRouter();
  const [kb,setKb] = useState<any[]>([]);
  const [form,setForm] = useState({
    url:"", provider:"YouTube", duration:"", subject:"", unit:"",
    topicId:"", title:"", description:"", thumb:"", order:"0", status:"Ready",
    is_premium: true // ADDED for subscription
  });
  const [previewId,setPreviewId] = useState("");

  useEffect(()=>{
    fetch("/api/admin/caps").then(r=>r.json()).then(d=>{ if(Array.isArray(d)) setKb(d); });
  },[]);

  // FIXED: Auto preview with 11-char check
  useEffect(()=>{
    const yid = getYoutubeId(form.url);
    if(yid.length===11){
      setPreviewId(yid);
      if(!form.thumb){
        setForm(f=> ({...f, thumb: `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`}));
      }
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yid}&format=json`)
     .then(r=>r.json()).then(d=>{ if(d.title &&!form.title) setForm(f=> ({...f, title: d.title})); }).catch(()=>{});
    } else if(form.url.length < 5){
      setPreviewId("");
    }
  },[form.url]);

  const subjects = ["mathematics","physical-sciences"];
  const filteredBySubject = form.subject? kb.filter(k=> (k.subject||"").toLowerCase().includes(form.subject.slice(0,4))) : kb;
  const units = [...new Set(filteredBySubject.map(k=> (k.caps_code||"").split("-")[0]).filter(Boolean))];
  const topics = form.unit? filteredBySubject.filter(k=> (k.caps_code||"").startsWith(form.unit)) : filteredBySubject;

  const save = async()=>{
    if(previewId.length!==11) return alert("Paste valid YouTube URL - ID must be 11 chars. You have: "+previewId);
    if(!form.topicId) return alert("Choose Topic");
    const pick = kb.find(k=>k.id===form.topicId);
    const res = await fetch("/api/admin/videos",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        youtube_id: previewId, // FIXED: now always 11 chars
        youtube_url: form.url,
        caps_topic_id: pick.id,
        caps_code: pick.caps_code,
        subject: form.subject,
        title: form.title || pick.topic,
        description: form.description,
        thumbnail_url: form.thumb || `https://i.ytimg.com/vi/${previewId}/hqdefault.jpg`,
        order: parseInt(form.order)||0,
        status: form.status,
        is_premium: form.is_premium
      })
    });
    const j = await res.json();
    if(!res.ok) return alert("ERROR: "+j.error);
    alert(`✅ Saved! ${pick.topic} [${previewId}]`);
    router.push("/admin/videos");
  };

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#1c1e2e",borderRadius:24,padding:16,border:"1px solid #252a44"}}>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:12}}>Add video - {kb.length} topics loaded {previewId? `• ID: ${previewId} (${previewId.length})`: ""}</h2>
        <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtu.be/..." style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"8px 0 12px"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value,unit:"",topicId:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Subject...</option>{subjects.map(s=><option key={s} value={s}>{s}</option>)}</select>
          <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value,topicId:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Unit... ({units.length})</option>{units.map(u=><option key={u} value={u}>{u}</option>)}</select>
          <select value={form.topicId} onChange={e=>{const id=e.target.value; const p=kb.find(k=>k.id===id); setForm({...form,topicId:id,title: p?.topic || ""})}} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Topic... ({topics.length})</option>{topics.map(k=><option key={k.id} value={k.id}>{k.caps_code} - {k.topic}</option>)}</select>
        </div>
        <label style={{fontSize:13}}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px",minHeight:70}}/>
        <label style={{fontSize:13}}>Thumbnail URL</label><input value={form.thumb} onChange={e=>setForm({...form,thumb:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>

        <label style={{display:"flex",gap:8,alignItems:"center",fontSize:13,marginTop:8}}>
          <input type="checkbox" checked={form.is_premium} onChange={e=>setForm({...form,is_premium:e.target.checked})}/>
          🔒 Premium only (uncheck = Free Preview)
        </label>

        {previewId && previewId.length===11 && (
          <div style={{marginTop:16,background:"#000",borderRadius:20,overflow:"hidden",border:"1px solid #333"}}>
            <iframe width="100%" height="220" src={`https://www.youtube.com/embed/${previewId}`} frameBorder="0" allowFullScreen/>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <Link href="/admin/videos" style={{background:"#252a44",color:"#fff",padding:"12px 20px",borderRadius:999,textDecoration:"none"}}>Cancel</Link>
          <button onClick={save} style={{background:"#8b8bff",color:"#000",padding:"12px 22px",borderRadius:999,fontWeight:800,border:"none"}}>Save</button>
        </div>
      </div>
    </div>
  )
}
