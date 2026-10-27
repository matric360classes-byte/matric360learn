"use client";
import { useState, useEffect, useMemo } from "react";
import { SUBJECTS_DATA } from "@/lib/subjects";

const getYouTubeId = (url:string)=>{
  const m=(url||"").match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\s?/]+)/);
  return m?.[1]||"";
};
const getThumb = (url:string)=>{
  const id=getYouTubeId(url);
  return id? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
};

export default function VideosAdminPage(){
  const [videos,setVideos]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [filterSub,setFilterSub]=useState("all");
  const [filterUnit,setFilterUnit]=useState("all");
  const [filterTopic,setFilterTopic]=useState("all");
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [editing,setEditing]=useState<any>(null);
  const [form,setForm]=useState({url:"",provider:"YouTube",duration:"",subject:"",unit:"",topic:"",title:"",description:"",thumbnail_url:"",order_index:"0",status:"Ready",is_free_preview:false});

  const loadVideos = async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const res=await fetch(`${url}/rest/v1/videos?select=*&order=order_index.asc&limit=1000`,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
    const data=await res.json();
    setVideos(Array.isArray(data)?data:[]);
    setLoading(false);
  };
  useEffect(()=>{loadVideos();},[]);

  const subjects=Object.entries(SUBJECTS_DATA as any);
  const units=useMemo(()=>{
    if(filterSub==="all") return [];
    return (SUBJECTS_DATA as any)[filterSub]?.sections?.flatMap((s:any)=>s.units.map((u:any)=>({...u,section:s.title})))||[];
  },[filterSub]);
  const topics=useMemo(()=> units.find((x:any)=>x.id===filterUnit)?.topics||[],[filterUnit,units]);
  const formUnits=useMemo(()=>!form.subject?[]:(SUBJECTS_DATA as any)[form.subject]?.sections?.flatMap((s:any)=>s.units)||[],[form.subject]);
  const formTopics=useMemo(()=>!form.unit?[]:formUnits.find((x:any)=>x.id===form.unit)?.topics||[],[form.unit,formUnits]);

  // --- WIRED PREMIUM / FREE PREVIEW ---
  const toggleFreePreview = async(v:any)=>{
    const supaUrl=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"};
    const newVal=!v.is_free_preview;
    // optimistic
    setVideos(prev=>prev.map(x=>x.id===v.id?{...x,is_free_preview:newVal}:x));
    const payload={is_free_preview:newVal, is_premium:!newVal, free_preview:newVal, premium:!newVal};
    await fetch(`${supaUrl}/rest/v1/videos?id=eq.${v.id}`,{method:"PATCH",headers,body:JSON.stringify(payload)});
  };

  const handleSave = async()=>{
    const supaUrl=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"};
    const payload:any={
      youtube_url:form.url, url:form.url, provider:form.provider.toLowerCase(),
      duration_sec: form.duration?parseInt(form.duration):null,
      subject:form.subject, unit_id:form.unit, topic:form.topic, caps_code:form.topic, lesson_node_id:form.unit,
      title:form.title, description:form.description,
      thumbnail_url:form.thumbnail_url||getThumb(form.url),
      order_index:parseInt(form.order_index||"0"), status:form.status.toLowerCase(),
      is_free_preview:form.is_free_preview, free_preview:form.is_free_preview, is_premium:!form.is_free_preview, premium:!form.is_free_preview
    };
    const url=editing?`${supaUrl}/rest/v1/videos?id=eq.${editing.id}`:`${supaUrl}/rest/v1/videos`;
    const method=editing?"PATCH":"POST";
    const res=await fetch(url,{method,headers,body:JSON.stringify(payload)});
    if(res.ok){ setShowAdd(false); setEditing(null); loadVideos(); } else alert("Save failed");
  };

  const filtered=videos.filter(v=>{
    if(filterSub!=="all" && v.subject && !v.subject.toLowerCase().includes(filterSub.split('-')[0])) return false;
    if(search && !(v.title||""+v.url||"").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h1 style={{fontSize:26,fontWeight:900}}>Videos — {videos.length} total</h1>
        <button onClick={()=>setShowAdd(true)} style={{background:"#7b7eff",border:"none",padding:"8px 16px",borderRadius:20,color:"#fff",fontWeight:800}}>+ Add video</button>
      </div>

      <select value={filterSub} onChange={e=>setFilterSub(e.target.value)} style={{width:"100%",background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12,marginBottom:8}}>
        <option value="all">All subjects</option>{subjects.map(([id,s]:any)=><option key={id} value={id}>{s.name}</option>)}
      </select>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title/URL" style={{width:"100%",background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12,marginBottom:12}}/>

      {filtered.map(v=>{
        const thumb=v.thumbnail_url||getThumb(v.youtube_url||v.url);
        const isFree=v.is_free_preview||v.free_preview;
        return(
          <div key={v.id} style={{background:"#1a1c2e",border:`1px solid ${isFree?"#1a4733":"#252a44"}`,borderRadius:20,padding:12,marginBottom:14}}>
            {thumb && <img src={thumb} style={{width:"100%",borderRadius:16,aspectRatio:"16/9",objectFit:"cover"}}/>}
            <div style={{marginTop:10,fontWeight:800,fontSize:16,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {v.title}
              {isFree ? <span style={{border:"1px solid #16a34a",color:"#22c55e",fontSize:10,padding:"2px 8px",borderRadius:10}}>FREE PREVIEW</span>
                       : <span style={{border:"1px solid #a16207",color:"#f59e0b",fontSize:10,padding:"2px 8px",borderRadius:10}}>PREMIUM</span>}
            </div>
            <div style={{fontSize:12,color:"#8a8a9a",marginTop:4}}>{v.youtube_url||v.url}</div>
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
              <button onClick={()=>toggleFreePreview(v)} style={{background:isFree?"#1a1c2e":"#122a1f",border:`1px solid ${isFree?"#2a2d4a":"#1a4733"}`,color:isFree?"#9aa0b6":"#22c55e",padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:700}}>
                {isFree ? "Set as Premium" : "Set as Free Preview"}
              </button>
              <button onClick={()=>{setEditing(v); setForm({url:v.youtube_url||v.url,provider:v.provider||"YouTube",duration:String(v.duration_sec||""),subject:v.subject||"",unit:v.unit_id||"",topic:v.topic||v.caps_code||"",title:v.title||"",description:v.description||"",thumbnail_url:v.thumbnail_url||"",order_index:String(v.order_index||0),status:v.status||"Ready",is_free_preview:!!(v.is_free_preview||v.free_preview)}); setShowAdd(true);}} style={{background:"#1f1f2e",border:"1px solid #2a2d4a",color:"#fff",padding:"6px 12px",borderRadius:20}}>✎ Edit</button>
              <button onClick={async()=>{if(confirm("Delete?")){const u=process.env.NEXT_PUBLIC_SUPABASE_URL!; const k=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; await fetch(`${u}/rest/v1/videos?id=eq.${v.id}`,{method:"DELETE",headers:{apikey:k,Authorization:`Bearer ${k}`}}); loadVideos();}}} style={{background:"#2a1a1a",border:"1px solid #4a2a2a",color:"#ef4444",padding:"6px 10px",borderRadius:20}}>🗑</button>
            </div>
          </div>
        )
      })}

      {showAdd && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:99,overflowY:"auto",padding:12}}>
          <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:24,padding:16,maxWidth:600,margin:"20px auto"}}>
            <h2 style={{fontSize:20,fontWeight:900,marginBottom:12}}>{editing?"Edit video":"Add video"}</h2>
            <input value={form.url} onChange={e=>{const val=e.target.value; setForm({...form,url:val,thumbnail_url:getThumb(val)||form.thumbnail_url});}} placeholder="https://youtu.be/..." style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12}}/>
            {form.url && getYouTubeId(form.url) && <iframe src={`https://www.youtube.com/embed/${getYouTubeId(form.url)}`} style={{width:"100%",height:200,borderRadius:12,border:"none",marginTop:8}}/>}
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value,unit:"",topic:""})} style={{flex:1,background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12}}>
                <option value="">Subject...</option>{subjects.map(([id,s]:any)=><option key={id} value={id}>{s.name}</option>)}
              </select>
              <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value,topic:""})} style={{flex:1,background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12}}>
                <option value="">Unit...</option>{formUnits.map((u:any)=><option key={u.id} value={u.id}>{u.title}</option>)}
              </select>
              <select value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} style={{flex:1,background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12}}>
                <option value="">Topic...</option>{formTopics.map((t:any)=><option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title" style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:10,borderRadius:12,marginTop:8}}/>
            <div style={{display:"flex",gap:12,alignItems:"center",marginTop:12}}>
              <label style={{display:"flex",gap:6,alignItems:"center",fontSize:13}}><input type="checkbox" checked={form.is_free_preview} onChange={e=>setForm({...form,is_free_preview:e.target.checked})}/> Free Preview (non-premium users can watch)</label>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
              <button onClick={()=>setShowAdd(false)} style={{background:"#1f1f2e",border:"1px solid #2a2d4a",color:"#fff",padding:"8px 16px",borderRadius:20}}>Cancel</button>
              <button onClick={handleSave} style={{background:"#7b7eff",border:"none",color:"#fff",padding:"8px 20px",borderRadius:20,fontWeight:800}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
