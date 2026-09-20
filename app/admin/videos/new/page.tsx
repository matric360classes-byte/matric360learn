"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function getId(url:string){ const m=url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1]:url.trim(); }

export default function NewVideoPage(){
  const router=useRouter();
  const [kb,setKb]=useState<any[]>([]);
  const [form,setForm]=useState({url:"",provider:"YouTube",duration:"",subject:"",unit:"",topic:"",title:"",description:"",thumb:"",order:"0",status:"Ready"});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{ (async()=>{
    const {data} = await supabase.from("caps_knowledge_base").select("id,subject,topic,caps_code").limit(1000);
    if(data) setKb(data);
  })() },[]);

  const subjects=["mathematics","physical-sciences"];
  const units = form.subject? ["",...Array.from(new Set(kb.filter(k=>k.subject.toLowerCase().includes(form.subject.slice(0,4))).map(k=>(k.caps_code||"").split("-")[0])))] : [""];
  const topics = form.subject && form.unit? kb.filter(k=>k.subject.toLowerCase().includes(form.subject.slice(0,4)) && (k.caps_code||"").startsWith(form.unit)) : [];

  // --- ONLY THIS SAVE FUNCTION IS FIXED ---
  const save=async()=>{
    if(!form.url) return alert("Paste YouTube URL");
    if(!form.topic) return alert("Choose Subject > Unit > Topic");
    setSaving(true);
    const yid=getId(form.url);
    const kbPick=kb.find(k=>k.caps_code===form.topic) || topics[0];

    // Minimal payload that WILL save + WILL show under Nodes
    const payload:any={
      youtube_id: yid,
      youtube_url: form.url,
      subject: form.subject,
      topic: kbPick?.topic || form.topic,
      caps_code: form.topic,
      caps_topic_id: kbPick?.id || null,
      title: form.title || kbPick?.topic || yid,
      description: form.description,
      thumbnail_url: form.thumb || `https://img.youtube.com/vi/${yid}/hqdefault.jpg`,
    };

    const {error} = await supabase.from("videos").insert([payload]);

    // THIS is what makes it show under Nodes A-E
    if(!error && kbPick){
      await supabase.from("caps_knowledge_base").update({ youtube_id: yid } as any).eq("id", kbPick.id);
      // also update topics table if you have it
      await supabase.from("topics").update({ youtube_id: yid } as any).eq("caps_code", form.topic);
    }

    setSaving(false);
    if(error) alert("SAVE ERROR: "+error.message);
    else { alert("✅ Video saved and linked to Nodes!"); router.push("/admin/videos"); }
  };

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",paddingBottom:90}}>
      <div style={{margin:12,background:"#121a14",border:"1px solid #1e3a2a",borderRadius:20,padding:"14px 16px",fontSize:13}}><span style={{color:"#00ff88",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank.</div>
      <div style={{padding:"0 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1 style={{fontSize:26,fontWeight:900}}>Videos</h1><Link href="/admin/videos/new" style={{background:"#8b8bff",color:"#fff",padding:"10px 18px",borderRadius:999,textDecoration:"none",fontWeight:800}}>+ Add video</Link></div>

      <div style={{margin:"12px",background:"#1c1e2e",borderRadius:24,padding:16,border:"1px solid #252a44"}}>
        <h2 style={{fontSize:20,fontWeight:800,marginBottom:12}}>Add video</h2>
        <label style={{fontSize:13}}>Video URL (YouTube or Bunny Stream)</label>
        <input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://youtu.be/..." style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"8px 0 12px"}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div><label style={{fontSize:13}}>Provider</label><select value={form.provider} onChange={e=>setForm({...form,provider:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}><option>YouTube</option><option>Bunny</option></select></div>
          <div><label style={{fontSize:13}}>Duration (sec)</label><input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}/></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
          <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value,unit:"",topic:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}>
            <option value="">Subject...</option>{subjects.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value,topic:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}>
            <option value="">Unit...</option>{units.filter(Boolean).map(u=><option key={u} value={u}>{u}</option>)}
          </select>
          <select value={form.topic} onChange={e=>{const t=e.target.value; const pick=kb.find(k=>k.caps_code===t); setForm({...form,topic:t,title: pick?.topic || form.title})}} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff"}}>
            <option value="">Topic...</option>{topics.map(k=><option key={k.id} value={k.caps_code}>{k.caps_code} - {k.topic}</option>)}
          </select>
        </div>

        <label style={{fontSize:13}}>Title</label><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",minHeight:90,margin:"6px 0 12px"}}/>
        <label style={{fontSize:13}}>Thumbnail URL</label><input value={form.thumb} onChange={e=>setForm({...form,thumb:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",margin:"6px 0 12px"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div><label style={{fontSize:13}}>Order</label><input value={form.order} onChange={e=>setForm({...form,order:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}/></div>
          <div><label style={{fontSize:13}}>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:14,padding:"14px",color:"#fff",marginTop:6}}><option>Ready</option><option>Draft</option></select></div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
          <Link href="/admin/videos" style={{background:"#252a44",color:"#fff",padding:"12px 20px",borderRadius:999,textDecoration:"none"}}>Cancel</Link>
          <button onClick={save} disabled={saving} style={{background:"#8b8bff",color:"#000",padding:"12px 22px",borderRadius:999,fontWeight:800,border:"none"}}>{saving?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>
  )
}
