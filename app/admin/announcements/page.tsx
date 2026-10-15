"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

const ADMIN_EMAIL = "megaluno28@gmail.com";

export default function AdminAnnouncements(){
  const [title,setTitle]=useState("");
  const [message,setMessage]=useState("");
  const [audience,setAudience]=useState("all");
  const [list,setList]=useState<any[]>([]);
  const [userEmail,setUserEmail]=useState("");

  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email||"");
      const { data } = await supabase.from("announcements").select("*").order("created_at",{ascending:false}).limit(50);
      if(data) setList(data);
    })();
  },[]);

  const isAdmin = userEmail === ADMIN_EMAIL;

  const send = async()=>{
    if(!isAdmin) return alert("Only super admin can send");
    if(!title ||!message) return alert("Add title and message");
    const { error } = await supabase.from("announcements").insert({ title, message, audience, created_by: userEmail });
    if(error) alert(error.message);
    else { setTitle(""); setMessage(""); alert(`Sent to ${audience.toUpperCase()} users`); location.reload(); }
  };

  const del = async(id:string)=>{
    if(!confirm("Delete?")) return;
    await supabase.from("announcements").delete().eq("id",id);
    setList(list.filter(l=>l.id!==id));
  };

  if(!isAdmin) return <div style={{padding:20, color:"white", background:"#0f0f14", minHeight:"100vh"}}>⛔ Only {ADMIN_EMAIL} can send announcements</div>;

  return(
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", padding:12, paddingBottom:90, fontFamily:"system-ui"}}>
      <h1 style={{fontSize:20, fontWeight:800}}>📢 Admin Announcements</h1>
      <div style={{background:"#1e1e28", borderRadius:18, padding:16, marginTop:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g. Mock Exams Are Live!" style={{width:"100%", background:"#0f0f14", border:"1px solid #2a2a32", borderRadius:10, padding:12, color:"white", marginBottom:10}} />
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message..." rows={4} style={{width:"100%", background:"#0f0f14", border:"1px solid #2a2a32", borderRadius:10, padding:12, color:"white"}} />
        <div style={{display:"flex", gap:8, marginTop:10}}>
          {[
            ["all","All Users"],
            ["premium","Premium Only"],
            ["free","Free Only"]
          ].map(([k,l])=>(
            <button key={k} onClick={()=>setAudience(k)} style={{padding:"8px 14px", borderRadius:20, border:"none", background: audience===k ? "#8b7cf8" : "#2a2a32", color: audience===k ? "black" : "white", fontWeight:700, fontSize:12}}>{l}</button>
          ))}
        </div>
        <button onClick={send} style={{marginTop:12, width:"100%", background:"#22c55e", color:"black", border:"none", borderRadius:12, padding:12, fontWeight:800}}>Send Announcement → {audience.toUpperCase()}</button>
      </div>

      <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
        {list.map(a=>(
          <div key={a.id} style={{background:"#1e1e28", borderRadius:14, padding:12, borderLeft:`4px solid ${a.audience==="premium"?"#facc15":a.audience==="free"?"#60a5fa":"#22c55e"}`}}>
            <div style={{display:"flex", justifyContent:"space-between"}}><b>{a.title}</b><span style={{fontSize:10, background:"#2a2a32", padding:"2px 8px", borderRadius:10}}>{a.audience.toUpperCase()}</span></div>
            <div style={{fontSize:12, color:"#9ca3af", marginTop:6}}>{a.message}</div>
            <div style={{fontSize:10, color:"#666", marginTop:6}}>{new Date(a.created_at).toLocaleString()} • <button onClick={()=>del(a.id)} style={{background:"none", border:"none", color:"#ef4444", cursor:"pointer"}}>Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
