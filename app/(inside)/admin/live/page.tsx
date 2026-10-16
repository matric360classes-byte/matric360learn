"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLive(){
  const [form,setForm]=useState({subject:"Mathematics", topic:"", start_time:"", duration_minutes:60, meet_link:"", recording_link:"", status:"upcoming"});
  const [lessons,setLessons]=useState<any[]>([]);

  const load = async()=>{
    const supabase = createClient();
    const { data } = await supabase.from("live_lessons").select("*").order("start_time",{ascending:false});
    if(data) setLessons(data);
  };
  useEffect(()=>{load()},[]);

  const save = async()=>{
    if(!form.topic || !form.start_time || !form.meet_link) return alert("Fill topic, time, meet link");
    const supabase = createClient();
    const { error } = await supabase.from("live_lessons").insert({...form, start_time:new Date(form.start_time).toISOString()});
    if(error) alert(error.message); else { setForm({...form, topic:"", start_time:"", meet_link:"", recording_link:""}); load(); }
  };

  const updateStatus = async(id:string,status:string)=>{
    const supabase = createClient();
    await supabase.from("live_lessons").update({status}).eq("id",id);
    load();
  };
  const del = async(id:string)=>{
    if(!confirm("Delete?")) return;
    const supabase = createClient();
    await supabase.from("live_lessons").delete().eq("id",id);
    load();
  };

  return (
    <div style={{padding:16, maxWidth:700, margin:"0 auto"}}>
      <h1 style={{fontSize:20,fontWeight:800, marginBottom:12}}>Schedule Live Lesson</h1>
      <div style={{background:"#15172a", border:"1px solid #252a44", borderRadius:14, padding:14, display:"flex", flexDirection:"column", gap:10, marginBottom:20}}>
        <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}>
          <option>Mathematics</option><option>Physical Sciences</option>
        </select>
        <input placeholder="Topic e.g. Calculus Paper 1" value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input type="datetime-local" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input type="number" placeholder="Duration minutes" value={form.duration_minutes} onChange={e=>setForm({...form,duration_minutes:parseInt(e.target.value)})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input placeholder="Google Meet Link" value={form.meet_link} onChange={e=>setForm({...form,meet_link:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <input placeholder="Recording Link (YouTube) optional" value={form.recording_link} onChange={e=>setForm({...form,recording_link:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}/>
        <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} style={{padding:10, borderRadius:8, background:"#0f111e", color:"white", border:"1px solid #252a44"}}>
          <option value="upcoming">upcoming</option><option value="live">live</option><option value="recorded">recorded</option>
        </select>
        <button onClick={save} style={{padding:12, borderRadius:10, background:"#7c7cff", color:"white", fontWeight:800, border:0, cursor:"pointer"}}>Save Lesson</button>
      </div>

      <h2 style={{fontWeight:700, marginBottom:8}}>All Lessons</h2>
      <div style={{display:"flex", flexDirection:"column", gap:10}}>
        {lessons.map(l=>(
          <div key={l.id} style={{background:"#15172a", border:"1px solid #252a44", borderRadius:12, padding:12}}>
            <div style={{fontWeight:700}}>{l.subject} - {l.topic}</div>
            <div style={{fontSize:12, color:"#94a3b8"}}>{new Date(l.start_time).toLocaleString()} • {l.status}</div>
            <div style={{display:"flex", gap:6, marginTop:8, flexWrap:"wrap"}}>
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
