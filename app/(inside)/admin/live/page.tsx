"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLive(){
  const [form,setForm]=useState({id:"", subject:"Mathematics", topic:"", start_time:"", duration_minutes:60, meet_link:"", recording_link:"", status:"upcoming"});
  const [lessons,setLessons]=useState<any[]>([]);
  const [editing,setEditing]=useState(false);

  const load = async()=>{
    const supabase = createClient();
    const { data } = await supabase.from("live_lessons").select("*").order("start_time",{ascending:false});
    if(data) setLessons(data);
  };
  useEffect(()=>{load()},[]);

  const save = async()=>{
    const supabase = createClient();
    const payload = {
      subject: form.subject,
      topic: form.topic,
      start_time: new Date(form.start_time).toISOString(),
      duration_minutes: form.duration_minutes,
      meet_link: form.meet_link,
      recording_link: form.recording_link,
      status: form.status
    };
    
    if(editing){
      const { error } = await supabase.from("live_lessons").update(payload).eq("id", form.id);
      if(error) alert(error.message); else { reset(); load(); }
    } else {
      if(!form.topic || !form.start_time || !form.meet_link) return alert("Fill topic, time, meet link");
      const { error } = await supabase.from("live_lessons").insert(payload);
      if(error) alert(error.message); else { reset(); load(); }
    }
  };

  const reset = ()=>{
    setForm({id:"", subject:"Mathematics", topic:"", start_time:"", duration_minutes:60, meet_link:"", recording_link:"", status:"upcoming"});
    setEditing(false);
  };

  const editLesson = (l:any)=>{
    // Convert DB time to input datetime-local format
    const dt = new Date(l.start_time);
    const local = new Date(dt.getTime() - dt.getTimezoneOffset()*60000).toISOString().slice(0,16);
    setForm({
      id: l.id,
      subject: l.subject,
      topic: l.topic,
      start_time: local,
      duration_minutes: l.duration_minutes,
      meet_link: l.meet_link || "",
      recording_link: l.recording_link || "",
      status: l.status
    });
    setEditing(true);
    window.scrollTo({top:0, behavior:"smooth"});
  };

  const updateStatus = async(id:string,status:string)=>{
    const supabase = createClient();
    await supabase.from("live_lessons").update({status}).eq("id",id);
    load();
  };
  const del = async(id:string)=>{
    if(!confirm("Delete this lesson?")) return;
    const supabase = createClient();
    await supabase.from("live_lessons").delete().eq("id",id);
    load();
  };

  return (
    <div style={{padding:16, maxWidth:700, margin:"0 auto"}}>
      <h1 style={{fontSize:20,fontWeight:800, marginBottom:12}}>{editing ? "Edit Live Lesson" : "Schedule Live Lesson"}</h1>
      
      <div style={{background:"#15172a", border:"1px solid #252a44", borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:10, marginBottom:20}}>
        <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}>
          <option>Mathematics</option><option>Physical Sciences</option>
        </select>
        <input placeholder="Topic e.g. GRADE 12 PURE MATHS PAPER 1" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input type="datetime-local" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input type="number" placeholder="Duration minutes" value={form.duration_minutes} onChange={e=>setForm({...form,duration_minutes:parseInt(e.target.value)||0})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input placeholder="Google Meet / Calendar Link https://calendar.app.google/..." value={form.meet_link} onChange={e=>setForm({...form,meet_link:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input placeholder="Recording Link (YouTube) optional" value={form.recording_link} onChange={e=>setForm({...form,recording_link:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}>
          <option value="upcoming">upcoming</option><option value="live">live</option><option value="recorded">recorded</option>
        </select>
        <div style={{display:"flex", gap:8}}>
          <button onClick={save} style={{flex:1, padding:12, borderRadius:10, background:"#7c7cff", color:"white", fontWeight:800, border:0, cursor:"pointer"}}>{editing ? "Update Lesson" : "Save Lesson"}</button>
          {editing && <button onClick={reset} style={{padding:12, borderRadius:10, background:"#232646", color:"white", fontWeight:700, border:0}}>Cancel</button>}
        </div>
      </div>

      <h2 style={{fontWeight:700, marginBottom:8}}>All Lessons</h2>
      <div style={{display:"flex", flexDirection:"column", gap:10}}>
        {lessons.map(l=>(
          <div key={l.id} style={{background:"#15172a", border:"1px solid #252a44", borderRadius:12, padding:12}}>
            <div style={{fontWeight:700}}>{l.subject} - {l.topic}</div>
            <div style={{fontSize:12, color:"#94a3b8"}}>{new Date(l.start_time).toLocaleString()} • {l.duration_minutes}min • {l.status}</div>
            <div style={{display:"flex", gap:6, marginTop:8, flexWrap:"wrap"}}>
              <button onClick={()=>editLesson(l)} style={{padding:"6px 12px", borderRadius:6, background:"white", color:"black", fontWeight:800, border:0}}>✏️ Edit</button>
              <button onClick={()=>updateStatus(l.id,"live")} style={{padding:"6px 10px", borderRadius:6, background:l.status==="live"?"#ef4444":"#232646", color:"white", border:0}}>Set LIVE</button>
              <button onClick={()=>updateStatus(l.id,"upcoming")} style={{padding:"6px 10px", borderRadius:6, background:l.status==="upcoming"?"#7c7cff":"#232646", color:"white", border:0}}>Set Upcoming</button>
              <button onClick={()=>updateStatus(l.id,"recorded")} style={{padding:"6px 10px", borderRadius:6, background:l.status==="recorded"?"#22c55e":"#232646", color:"white", border:0}}>Set Recorded</button>
              <button onClick={()=>del(l.id)} style={{padding:"6px 10px", borderRadius:6, background:"#1f1212", color:"#ef4444", border:"1px solid #ef4444", marginLeft:"auto"}}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
