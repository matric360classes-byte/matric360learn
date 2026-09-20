"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const getYtId=(u:string)=>{const m=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([^&?\/]+)/); return m?m[1]:u.trim();};
const MATH_UNITS=["Algebra","Functions & Graphs","Finance","Trigonometry","Euclidean Geometry","Analytical Geometry","Statistics","Calculus","Probability"];
const PHYSICS_UNITS=["Mechanics","Waves Sound Light","Electricity Magnetism","Matter Materials","Chemical Change"];

export default function NewVideo(){
  const router=useRouter();
  const [topics,setTopics]=useState<any[]>([]);
  const [f,setF]=useState({url:"",provider:"YouTube",subj:"Mathematics",unit:"",topicCode:"",title:"",desc:"",thumb:"",order:"0",status:"Ready"});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{(async()=>{
    const {data}=await supabase.from("topics").select("id,subject,caps_code,topic,paper_section").limit(2000);
    if(data) setTopics(data);
  })()},[]);

  const forSubj = topics.filter(t=>(t.subject||"").toLowerCase().includes(f.subj.slice(0,4).toLowerCase()));
  const dbUnits = Array.from(new Set(forSubj.map(t=>t.paper_section).filter(Boolean))) as string[];
  const units = dbUnits.length>0? dbUnits : (f.subj==="Mathematics"? MATH_UNITS : PHYSICS_UNITS);
  const forUnit = forSubj; // show all topics for chosen subject - never empty

  const save=async()=>{
    if(!f.url) return alert("Paste URL");
    if(!f.topicCode) return alert("Choose Topic");
    setSaving(true);
    const yid=getYtId(f.url);
    const pick=topics.find(t=>t.caps_code===f.topicCode);
    const payload:any={
      youtube_id:yid, youtube_url:f.url, title:f.title||pick?.topic||yid,
      subject:f.subj, caps_code:f.topicCode, caps_topic_id:pick?.id||null,
      topic:pick?.topic||f.topicCode,
      thumbnail_url:f.thumb||`https://img.youtube.com/vi/${yid}/hqdefault.jpg`,
    };
    const {error}=await supabase.from("videos").insert([payload]);
    if(!error && pick) await supabase.from("topics").update({youtube_id:yid}).eq("id",pick.id);
    setSaving(false);
    if(error) alert("SAVE ERROR: "+error.message); else { alert("✅ Saved!"); router.push("/admin/videos"); }
  };

  return(
    <div style={{background:"#0b0c14",minHeight:"100vh",color:"#fff",padding:12}}>
      <div style={{background:"#1c1e2e",border:"1px solid #252a44",borderRadius:24,padding:16}}>
        <h2 style={{fontSize:20,fontWeight:800}}>Add video</h2>
        <input value={f.url} onChange={e=>setF({...f,url:e.target.value})} placeholder="https://youtu.be/..." style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"#fff",margin:"8px 0"}}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          <select value={f.subj} onChange={e=>setF({...f,subj:e.target.value,unit:"",topicCode:""})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"#fff"}}><option>Mathematics</option><option>Physical Sciences</option></select>
          <select value={f.unit} onChange={e=>setF({...f,unit:e.target.value})} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"#fff"}}><option value="">Unit...</option>{units.map(u=><option key={u} value={u}>{u}</option>)}</select>
          <select value={f.topicCode} onChange={e=>{const c=e.target.value; const p=topics.find(t=>t.caps_code===c); setF({...f,topicCode:c,title:p?.topic||""})}} style={{background:"#12131f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"#fff"}}><option value="">Topic... ({forUnit.length})</option>{forUnit.map(t=><option key={t.id} value={t.caps_code}>{t.caps_code} - {t.topic?.slice(0,30)}</option>)}</select>
        </div>
        <input value={f.title} onChange={e=>setF({...f,title:e.target.value})} placeholder="Title auto-fills" style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"#fff",marginBottom:8}}/>
        <textarea value={f.desc} onChange={e=>setF({...f,desc:e.target.value})} placeholder="Description" style={{width:"100%",background:"#12131f",border:"1px solid #252a44",borderRadius:12,padding:14,color:"#fff",marginBottom:8}}/>
        <div style={{display:"flex",justifyContent:"flex-end",gap:10}}><Link href="/admin/videos" style={{background:"#252a44",padding:"12px 20px",borderRadius:999,color:"#fff",textDecoration:"none"}}>Cancel</Link><button onClick={save} disabled={saving} style={{background:"#8b8bff",padding:"12px 22px",borderRadius:999,fontWeight:800,border:"none"}}>{saving?"Saving...":"Save"}</button></div>
      </div>
    </div>
  )
}
