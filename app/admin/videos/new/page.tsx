"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getYoutubeId(url:string){
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|vi\/)([^&?\/\s]{6,})/);
  return m? m[1].split("?")[0] : "";
}

export default function NewVideoPage(){
  const router = useRouter();
  const [kb,setKb] = useState<any[]>([]);
  const [form,setForm] = useState({
    url:"", provider:"YouTube", duration:"", subject:"", unit:"",
    topicId:"", title:"", description:"", thumb:"", order:"0", status:"Ready"
  });
  const [previewId,setPreviewId] = useState("");
  const [loadingMeta,setLoadingMeta] = useState(false);

  useEffect(()=>{ (async()=>{
    const {data} = await supabase.from("caps_knowledge_base").select("id,subject,topic,caps_code").limit(1000);
    if(data) setKb(data);
  })() },[]);

  // THIS IS THE MAGIC - Auto preview as you type
  useEffect(()=>{
    const url = form.url.trim();
    if(!url) { setPreviewId(""); return; }

    const yid = getYoutubeId(url);
    if(yid && yid.length > 5){
      setPreviewId(yid);
      // Auto fill thumbnail like your screenshot
      const thumbUrl = `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
      if(!form.thumb || form.thumb.includes("ytimg")) {
        setForm(f => ({...f, thumb: thumbUrl, provider: "YouTube"}));
      }
      // Auto fetch title from YouTube oEmbed (no API key needed)
      setLoadingMeta(true);
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yid}&format=json`)
       .then(r=>r.json())
       .then(d=>{
          if(d.title &&!form.title) {
            setForm(f=>({...f, title: d.title}));
          }
        })
       .catch(()=>{})
       .finally(()=>setLoadingMeta(false));
    } else if(url.includes("bunny") || url.includes("mediadelivery")){
      setPreviewId(""); // Bunny preview needs iframe
      setForm(f=>({...f, provider: "Bunny"}));
    }
  },[form.url]);

  const subjects = ["mathematics","physical-sciences"];
  const units = form.subject? [...new Set(kb.filter(k=>k.subject.toLowerCase().includes(form.subject.slice(0,4))).map(k=>(k.caps_code||"").split("-")[0]).filter(Boolean))] : [];
  const topics = form.subject? kb.filter(k=>k.subject.toLowerCase().includes(form.subject.slice(0,4)) && (form.unit? (k.caps_code||"").startsWith(form.unit) : true)) : [];

  const save = async()=>{
    if(!form.url ||!previewId) return alert("Paste valid YouTube URL");
    if(!form.topicId) return alert("Choose Subject > Unit > Topic");
    const pick = kb.find(k=>k.id===form.topicId);
    const res = await fetch("/api/admin/videos",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        youtube_id: previewId,
        youtube_url: form.url,
        caps_topic_id: pick.id,
        caps_code: pick.caps_code,
        subject: form.subject,
        title: form.title || pick.topic,
        description: form.description,
        thumbnail_url: form.thumb,
        order: parseInt(form.order)||0,
        status: form.status
      })
    });
    const j = await res.json();
    if(!res.ok) return alert("ERROR: "+j.error);
    alert(`✅ Saved! ${pick.topic}`);
    router.push("/admin/videos");
  };

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",fontSize:13}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank.</div>
      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1 style={{fontSize:26,fontWeight:900}}>Videos</h1><Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link></div>

      <div style={{margin:"12px",background:"#1c1e2e",borderRadius:24,padding:16,border:"1px solid #252a44"}}>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:12}}>Add video</h2>

        <label style={{fontSize:13}}>Video URL (YouTube or Bunny Stream)</label>
        <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtu.be/..." style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"8px 0 12px",outline:"none"}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div><label style={{fontSize:13}}>Provider</label>
            <select value={form.provider} onChange={e=>setForm({...form,provider:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}><option>YouTube</option><option>Bunny</option></select>
          </div>
          <div><label style={{fontSize:13}}>Duration (sec) {loadingMeta?"- loading...":""}</label>
            <input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="Auto" style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value,unit:"",topicId:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Subject...</option>{subjects.map(s=><option key={s} value={s}>{s}</option>)}</select>
          <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value,topicId:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Unit...</option>{units.map(u=><option key={u} value={u}>{u}</option>)}</select>
          <select value={form.topicId} onChange={e=>{const id=e.target.value; const pick=kb.find(k=>k.id===id); setForm({...form,topicId:id,title: pick?.topic || form.title})}} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Topic... ({topics.length})</option>{topics.map(k=><option key={k.id} value={k.id}>{k.caps_code} - {k.topic}</option>)}</select>
        </div>

        <label style={{fontSize:13}}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",minHeight:90,margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Thumbnail URL</label><input value={form.thumb} onChange={e=>setForm({...form,thumb:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={{fontSize:13}}>Order</label><input value={form.order} onChange={e=>setForm({...form,order:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}/></div>
          <div><label style={{fontSize:13}}>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}><option>Ready</option><option>Draft</option></select></div>
        </div>

        {/* INSTANT PREVIEW - Like your screenshot */}
        {previewId && (
          <div style={{marginTop:16,background:"#000",borderRadius:20,overflow:"hidden",border:"1px solid #333"}}>
            <iframe
              width="100%" height="220"
              src={`https://www.youtube.com/embed/${previewId}?modestbranding=1`}
              frameBorder="0"
              allowFullScreen
              style={{display:"block"}}
            />
            <div style={{padding:"10px 14px",background:"#0f0f0f",fontSize:12,color:"#aaa"}}>
              Preview: {form.title || "Loading title..."} • ID: {previewId}
            </div>
          </div>
        )}

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <Link href="/admin/videos" style={{background:"#252a44",color:"#fff",padding:"12px 20px",borderRadius:999,textDecoration:"none"}}>Cancel</Link>
          <button onClick={save} style={{background:"#8b8bff",color:"#000",padding:"12px 22px",borderRadius:999,fontWeight:800,border:"none"}}>Save</button>
        </div>
      </div>
    </div>
  )
}"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getYoutubeId(url:string){
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|vi\/)([^&?\/\s]{6,})/);
  return m? m[1].split("?")[0] : "";
}

export default function NewVideoPage(){
  const router = useRouter();
  const [kb,setKb] = useState<any[]>([]);
  const [form,setForm] = useState({
    url:"", provider:"YouTube", duration:"", subject:"", unit:"",
    topicId:"", title:"", description:"", thumb:"", order:"0", status:"Ready"
  });
  const [previewId,setPreviewId] = useState("");
  const [loadingMeta,setLoadingMeta] = useState(false);

  useEffect(()=>{ (async()=>{
    const {data} = await supabase.from("caps_knowledge_base").select("id,subject,topic,caps_code").limit(1000);
    if(data) setKb(data);
  })() },[]);

  // THIS IS THE MAGIC - Auto preview as you type
  useEffect(()=>{
    const url = form.url.trim();
    if(!url) { setPreviewId(""); return; }

    const yid = getYoutubeId(url);
    if(yid && yid.length > 5){
      setPreviewId(yid);
      // Auto fill thumbnail like your screenshot
      const thumbUrl = `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
      if(!form.thumb || form.thumb.includes("ytimg")) {
        setForm(f => ({...f, thumb: thumbUrl, provider: "YouTube"}));
      }
      // Auto fetch title from YouTube oEmbed (no API key needed)
      setLoadingMeta(true);
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${yid}&format=json`)
       .then(r=>r.json())
       .then(d=>{
          if(d.title &&!form.title) {
            setForm(f=>({...f, title: d.title}));
          }
        })
       .catch(()=>{})
       .finally(()=>setLoadingMeta(false));
    } else if(url.includes("bunny") || url.includes("mediadelivery")){
      setPreviewId(""); // Bunny preview needs iframe
      setForm(f=>({...f, provider: "Bunny"}));
    }
  },[form.url]);

  const subjects = ["mathematics","physical-sciences"];
  const units = form.subject? [...new Set(kb.filter(k=>k.subject.toLowerCase().includes(form.subject.slice(0,4))).map(k=>(k.caps_code||"").split("-")[0]).filter(Boolean))] : [];
  const topics = form.subject? kb.filter(k=>k.subject.toLowerCase().includes(form.subject.slice(0,4)) && (form.unit? (k.caps_code||"").startsWith(form.unit) : true)) : [];

  const save = async()=>{
    if(!form.url ||!previewId) return alert("Paste valid YouTube URL");
    if(!form.topicId) return alert("Choose Subject > Unit > Topic");
    const pick = kb.find(k=>k.id===form.topicId);
    const res = await fetch("/api/admin/videos",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        youtube_id: previewId,
        youtube_url: form.url,
        caps_topic_id: pick.id,
        caps_code: pick.caps_code,
        subject: form.subject,
        title: form.title || pick.topic,
        description: form.description,
        thumbnail_url: form.thumb,
        order: parseInt(form.order)||0,
        status: form.status
      })
    });
    const j = await res.json();
    if(!res.ok) return alert("ERROR: "+j.error);
    alert(`✅ Saved! ${pick.topic}`);
    router.push("/admin/videos");
  };

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",fontSize:13}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank.</div>
      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1 style={{fontSize:26,fontWeight:900}}>Videos</h1><Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link></div>

      <div style={{margin:"12px",background:"#1c1e2e",borderRadius:24,padding:16,border:"1px solid #252a44"}}>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:12}}>Add video</h2>

        <label style={{fontSize:13}}>Video URL (YouTube or Bunny Stream)</label>
        <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtu.be/..." style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"8px 0 12px",outline:"none"}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div><label style={{fontSize:13}}>Provider</label>
            <select value={form.provider} onChange={e=>setForm({...form,provider:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}><option>YouTube</option><option>Bunny</option></select>
          </div>
          <div><label style={{fontSize:13}}>Duration (sec) {loadingMeta?"- loading...":""}</label>
            <input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} placeholder="Auto" style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}/>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value,unit:"",topicId:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Subject...</option>{subjects.map(s=><option key={s} value={s}>{s}</option>)}</select>
          <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value,topicId:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Unit...</option>{units.map(u=><option key={u} value={u}>{u}</option>)}</select>
          <select value={form.topicId} onChange={e=>{const id=e.target.value; const pick=kb.find(k=>k.id===id); setForm({...form,topicId:id,title: pick?.topic || form.title})}} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}><option value="">Topic... ({topics.length})</option>{topics.map(k=><option key={k.id} value={k.id}>{k.caps_code} - {k.topic}</option>)}</select>
        </div>

        <label style={{fontSize:13}}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",minHeight:90,margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Thumbnail URL</label><input value={form.thumb} onChange={e=>setForm({...form,thumb:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={{fontSize:13}}>Order</label><input value={form.order} onChange={e=>setForm({...form,order:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}/></div>
          <div><label style={{fontSize:13}}>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}><option>Ready</option><option>Draft</option></select></div>
        </div>

        {/* INSTANT PREVIEW - Like your screenshot */}
        {previewId && (
          <div style={{marginTop:16,background:"#000",borderRadius:20,overflow:"hidden",border:"1px solid #333"}}>
            <iframe
              width="100%" height="220"
              src={`https://www.youtube.com/embed/${previewId}?modestbranding=1`}
              frameBorder="0"
              allowFullScreen
              style={{display:"block"}}
            />
            <div style={{padding:"10px 14px",background:"#0f0f0f",fontSize:12,color:"#aaa"}}>
              Preview: {form.title || "Loading title..."} • ID: {previewId}
            </div>
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
