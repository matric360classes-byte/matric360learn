"use client";
import { useState, useEffect, useMemo } from "react";
import { SUBJECTS_DATA } from "@/lib/subjects";

const norm = (s:string)=> (s||"").toLowerCase();
const getYouTubeId = (url:string)=>{
  if(!url) return "";
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\s?/]+)/);
  return m?.[1] || "";
};
const getThumb = (url:string)=>{
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
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
    const headers:any={apikey:key,Authorization:`Bearer ${key}`};
    const res=await fetch(`${url}/rest/v1/videos?select=*&order=order_index.asc&limit=1000`,{headers});
    const data=await res.json();
    setVideos(Array.isArray(data)? data : []);
    setLoading(false);
  };
  useEffect(()=>{ loadVideos(); },[]);

  const subjects = Object.entries(SUBJECTS_DATA as any);
  const units = useMemo(()=>{
    if(filterSub==="all") return [];
    const subj=(SUBJECTS_DATA as any)[filterSub];
    return subj?.sections?.flatMap((s:any)=> s.units.map((u:any)=> ({...u,section:s.title}))) || [];
  },[filterSub]);
  const topics = useMemo(()=>{
    if(filterUnit==="all") return [];
    const u = units.find((x:any)=> x.id===filterUnit);
    return u?.topics || [];
  },[filterUnit,units]);

  const formUnits = useMemo(()=>{
    if(!form.subject) return [];
    const subj=(SUBJECTS_DATA as any)[form.subject];
    return subj?.sections?.flatMap((s:any)=> s.units) || [];
  },[form.subject]);
  const formTopics = useMemo(()=>{
    if(!form.unit) return [];
    const u = formUnits.find((x:any)=> x.id===form.unit);
    return u?.topics || [];
  },[form.unit,formUnits]);

  const filtered = videos.filter(v=>{
    if(filterSub!=="all" && !norm(v.subject||"").includes(norm(filterSub).split('-')[0]) && v.subject) return false;
    if(filterUnit!=="all" && v.unit_id!==filterUnit && v.lesson_node_id!==filterUnit) {
      if(!norm(v.caps_code||""+v.topic||"").includes(norm(filterUnit))) return false;
    }
    if(filterTopic!=="all" && v.topic!==filterTopic && v.caps_code!==filterTopic) return false;
    if(search && !norm(v.title||""+v.url||""+v.youtube_url||"").includes(norm(search))) return false;
    return true;
  });

  const handlePasteUrl = (url:string)=>{
    const id=getYouTubeId(url);
    const thumb=id? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
    setForm(f=> ({...f,url,thumbnail_url: thumb || f.thumbnail_url}));
  };

  // === ONLY NEW: WIRED TOGGLE ===
  const toggleFreePreview = async(v:any)=>{
    const supaUrl=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"};
    const newVal = !(v.is_free_preview || v.free_preview);
    setVideos(prev=>prev.map(x=>x.id===v.id?{...x,is_free_preview:newVal,free_preview:newVal,is_premium:!newVal,premium:!newVal}:x));
    const payload={is_free_preview:newVal,free_preview:newVal,is_premium:!newVal,premium:!newVal};
    await fetch(`${supaUrl}/rest/v1/videos?id=eq.${v.id}`,{method:"PATCH",headers,body:JSON.stringify(payload)});
  };

  const handleSave = async()=>{
    const supaUrl=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const headers:any={apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"};
    const payload:any={
      youtube_url: form.url,
      url: form.url,
      provider: form.provider.toLowerCase(),
      duration_sec: form.duration ? parseInt(form.duration) : null,
      subject: form.subject,
      unit_id: form.unit,
      topic: form.topic,
      caps_code: form.topic,
      lesson_node_id: form.unit,
      title: form.title,
      description: form.description,
      thumbnail_url: form.thumbnail_url || getThumb(form.url),
      order_index: parseInt(form.order_index||"0"),
      status: form.status.toLowerCase(),
      is_free_preview: form.is_free_preview,
      free_preview: form.is_free_preview,
      is_premium: !form.is_free_preview,
      premium: !form.is_free_preview,
    };
    let res;
    if(editing){
      res=await fetch(`${supaUrl}/rest/v1/videos?id=eq.${editing.id}`,{method:"PATCH",headers,body:JSON.stringify(payload)});
    }else{
      res=await fetch(`${supaUrl}/rest/v1/videos`,{method:"POST",headers,body:JSON.stringify(payload)});
    }
    if(res.ok){ setShowAdd(false); setEditing(null); setForm({url:"",provider:"YouTube",duration:"",subject:"",unit:"",topic:"",title:"",description:"",thumbnail_url:"",order_index:"0",status:"Ready",is_free_preview:false}); loadVideos(); }
    else{ alert("Save failed"); }
  };

  const handleDelete = async(id:string)=>{
    if(!confirm("Delete video?")) return;
    const supaUrl=process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    await fetch(`${supaUrl}/rest/v1/videos?id=eq.${id}`,{method:"DELETE",headers:{apikey:key,Authorization:`Bearer ${key}`}});
    loadVideos();
  };

  return(
    <div style={{background:"#0e0f1a",minHeight:"100vh",color:"#fff",padding:"12px"}}>
      <div style={{background:"#122a1f",border:"1px solid #1a4733",padding:"12px 16px",borderRadius:16,marginBottom:16,fontSize:13}}>
        <span style={{color:"#22c55e",fontWeight:800}}>Content Admin mode</span> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.
      </div>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h1 style={{fontSize:26,fontWeight:900}}>Videos</h1>
        <button onClick={()=>{setShowAdd(true); setEditing(null);}} style={{background:"#7b7eff",border:"none",padding:"8px 16px",borderRadius:20,color:"#fff",fontWeight:800}}>+ Add video</button>
      </div>

      <select value={filterSub} onChange={e=>{setFilterSub(e.target.value); setFilterUnit("all"); setFilterTopic("all");}} style={{width:"100%",background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,marginBottom:8}}>
        <option value="all">All subjects</option>
        {subjects.map(([id,s]:any)=><option key={id} value={id}>{s.name}</option>)}
      </select>
      <select value={filterUnit} onChange={e=>{setFilterUnit(e.target.value); setFilterTopic("all");}} style={{width:"100%",background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,marginBottom:8}}>
        <option value="all">All units</option>
        {units.map((u:any)=><option key={u.id} value={u.id}>{u.title}</option>)}
      </select>
      <select value={filterTopic} onChange={e=>setFilterTopic(e.target.value)} style={{width:"100%",background:"#1a1c2e",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,marginBottom:8}}>
        <option value="all">All topics</option>
        {topics.map((t:any)=><option key={t.id} value={t.id}>{t.title}</option>)}
      </select>
      <div style={{display:"flex",alignItems:"center",background:"#1a1c2e",border:"1px solid #252a44",borderRadius:12,padding:"8px 12px",marginBottom:16}}>
        <span style={{marginRight:8}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title/URL" style={{flex:1,background:"transparent",border:"none",color:"#fff",outline:"none"}}/>
      </div>

      {loading? <div>Loading {videos.length} videos...</div> : filtered.map((v:any)=>{
        const thumb = v.thumbnail_url || getThumb(v.youtube_url||v.url);
        const isFree = v.is_free_preview || v.free_preview;
        return(
          <div key={v.id} style={{background:"#1a1c2e",border:`1px solid ${isFree?"#1a4733":"#252a44"}`,borderRadius:20,padding:12,marginBottom:14}}>
            {thumb && <img src={thumb} style={{width:"100%",borderRadius:16,aspectRatio:"16/9",objectFit:"cover",background:"#000"}}/>}
            {!thumb && v.youtube_url && <iframe src={`https://www.youtube.com/embed/${getYouTubeId(v.youtube_url)}`} style={{width:"100%",height:200,borderRadius:16,border:"none"}}/>}
            <div style={{marginTop:10,fontWeight:800,fontSize:16,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>{v.title} {isFree?<span style={{border:"1px solid #16a34a",color:"#22c55e",fontSize:10,padding:"2px 8px",borderRadius:10}}>FREE PREVIEW</span>:<span style={{border:"1px solid #a16207",color:"#f59e0b",fontSize:10,padding:"2px 8px",borderRadius:10}}>PREMIUM</span>}</div>
            <div style={{fontSize:12,color:"#8a8a9a",marginTop:4}}>— · {v.provider||"youtube"} · #{v.order_index} <br/>{v.youtube_url||v.url}</div>
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
              <button onClick={()=>toggleFreePreview(v)} style={{background:isFree?"#1a1c2e":"#122a1f",border:`1px solid ${isFree?"#2a2d4a":"#1a4733"}`,color:isFree?"#9aa0b6":"#22c55e",padding:"6px 12px",borderRadius:20,fontSize:12,fontWeight:700}}>{isFree?"Set as Premium":"Set as Free Preview"}</button>
              <button style={{background:"#1f1f2e",border:"1px solid #2a2d4a",color:"#fff",padding:"6px 10px",borderRadius:20}}>↑</button>
              <button style={{background:"#1f1f2e",border:"1px solid #2a2d4a",color:"#fff",padding:"6px 10px",borderRadius:20}}>↓</button>
              <button onClick={()=>{setEditing(v); setForm({url:v.youtube_url||v.url,provider:v.provider||"YouTube",duration:String(v.duration_sec||""),subject:v.subject||"",unit:v.unit_id||v.lesson_node_id||"",topic:v.topic||v.caps_code||"",title:v.title||"",description:v.description||"",thumbnail_url:v.thumbnail_url||"",order_index:String(v.order_index||0),status:v.status||"Ready",is_free_preview:!!(v.is_free_preview||v.free_preview)}); setShowAdd(true);}} style={{background:"#1f1f2e",border:"1px solid #2a2d4a",color:"#fff",padding:"6px 10px",borderRadius:20}}>✎</button>
              <button onClick={()=>handleDelete(v.id)} style={{background:"#2a1a1a",border:"1px solid #4a2a2a",color:"#ef4444",padding:"6px 10px",borderRadius:20}}>🗑</button>
            </div>
          </div>
        )
      })}
      {!loading && <div style={{textAlign:"center",color:"#6b7280",fontSize:12,marginTop:10}}>{filtered.length} / {videos.length} videos</div>}

      {showAdd && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:99,overflowY:"auto",padding:12}}>
          <div style={{background:"#1a1c2e",border:"1px solid #252a44",borderRadius:24,padding:16,maxWidth:600,margin:"20px auto"}}>
            <h2 style={{fontSize:20,fontWeight:900,marginBottom:12}}>{editing? "Edit video" : "Add video"}</h2>
            <label style={{fontSize:13,fontWeight:700}}>Video URL (YouTube or Bunny Stream)</label>
            <input value={form.url} onChange={e=>handlePasteUrl(e.target.value)} placeholder="https://youtu.be/..." style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,margin:"6px 0 8px"}}/>
            {form.url && getYouTubeId(form.url) && (
              <div style={{marginBottom:12}}>
                <iframe src={`https://www.youtube.com/embed/${getYouTubeId(form.url)}`} style={{width:"100%",height:200,borderRadius:12,border:"none"}}/>
                <div style={{fontSize:11,color:"#8a8a9a",marginTop:4}}>Preview — will auto-fill thumbnail</div>
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1}}><label style={{fontSize:13}}>Provider</label>
                <select value={form.provider} onChange={e=>setForm({...form,provider:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}>
                  <option>YouTube</option><option>Bunny</option>
                </select>
              </div>
              <div style={{flex:1}}><label style={{fontSize:13}}>Duration (sec)</label>
                <input value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}/>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value,unit:"",topic:""})} style={{flex:1,background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}>
                <option value="">Subject...</option>
                {subjects.map(([id,s]:any)=><option key={id} value={id}>{s.name}</option>)}
              </select>
              <select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value,topic:""})} style={{flex:1,background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}>
                <option value="">Unit...</option>
                {formUnits.map((u:any)=><option key={u.id} value={u.id}>{u.title}</option>)}
              </select>
              <select value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} style={{flex:1,background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}>
                <option value="">Topic...</option>
                {formTopics.map((t:any)=><option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <label style={{fontSize:13,marginTop:10,display:"block"}}>Title</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,marginTop:6}}/>
            <label style={{fontSize:13,marginTop:10,display:"block"}}>Description</label>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,marginTop:6,minHeight:80}}/>
            <label style={{fontSize:13,marginTop:10,display:"block"}}>Thumbnail URL</label>
            <input value={form.thumbnail_url} onChange={e=>setForm({...form,thumbnail_url:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12,marginTop:6}}/>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <div style={{flex:1}}><label style={{fontSize:13}}>Order</label><input value={form.order_index} onChange={e=>setForm({...form,order_index:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}/></div>
              <div style={{flex:1}}><label style={{fontSize:13}}>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{width:"100%",background:"#0e0f1a",border:"1px solid #252a44",color:"#fff",padding:"10px",borderRadius:12}}><option>Ready</option><option>Draft</option><option>Processing</option></select></div>
            </div>
            <label style={{display:"flex",gap:8,alignItems:"center",marginTop:12,fontSize:13}}><input type="checkbox" checked={form.is_free_preview} onChange={e=>setForm({...form,is_free_preview:e.target.checked})}/> Free Preview (non-premium users can watch)</label>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
              <button onClick={()=>{setShowAdd(false); setEditing(null);}} style={{background:"#1f1f2e",border:"1px solid #2a2d4a",color:"#fff",padding:"8px 16px",borderRadius:20}}>Cancel</button>
              <button onClick={handleSave} style={{background:"#7b7eff",border:"none",color:"#fff",padding:"8px 20px",borderRadius:20,fontWeight:800}}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
