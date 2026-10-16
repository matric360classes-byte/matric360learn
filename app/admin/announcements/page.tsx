"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "megaluno28@gmail.com";

export default function AdminAnnouncements(){
  const router = useRouter();
  const supabase = createClient();
  const [title,setTitle]=useState("");
  const [message,setMessage]=useState("");
  const [audience,setAudience]=useState("all");
  const [list,setList]=useState<any[]>([]);
  const [userEmail,setUserEmail]=useState("");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email?.toLowerCase() || "";
      setUserEmail(email);
      setLoading(false);

      const { data } = await supabase.from("announcements").select("*").order("created_at",{ascending:false}).limit(50);
      if(data) setList(data);
    })();
  },[]);

  const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase();

  const send = async()=>{
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

  if(loading) return <div style={{padding:20, color:"white", background:"#0f0f14", minHeight:"100vh"}}>Loading...</div>;

  if(!isAdmin) return (
    <div style={{padding:20, color:"white", background:"#0f0f14", minHeight:"100vh"}}>
      <div style={{background:"#1e1e28", padding:16, borderRadius:12}}>
        <div>⛔ Only {ADMIN_EMAIL} can send announcements</div>
        <div style={{fontSize:12, color:"#94a3b8", marginTop:8}}>You are logged in as: <b style={{color:"white"}}>{userEmail || "NOT LOGGED IN"}</b></div>
        <div style={{fontSize:12, color:"#94a3b8", marginTop:4}}>Please logout and login with {ADMIN_EMAIL}</div>
        <button onClick={()=>router.push("/login")} style={{marginTop:12, background:"white", color:"black", border:"none", padding:"10px 16px", borderRadius:10, fontWeight:800}}>Go to Login</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", padding:12, paddingBottom:90, fontFamily:"system-ui"}}>
      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        <button onClick={()=>router.push("/dashboard")} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:12, width:40, height:40}}>←</button>
        <h1 style={{fontSize:20, fontWeight:800}}>📢 Admin Announcements</h1>
      </div>
      <div style={{fontSize:11, color:"#22c55e", marginTop:6}}>Logged in as {userEmail} (Super Admin)</div>

      <div style={{background:"#1e1e28", borderRadius:18, padding:16, marginTop:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title e.g. Mock Exams Are Live!" style={{width:"100%", background:"#0f0f14", border:"1px solid #2a2a32", borderRadius:10, padding:12, color:"white", marginBottom:10}} />
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message..." rows={4} style={{width:"100%", background:"#0f0f14", border:"1px solid #2a2a32", borderRadius:10, padding:12, color:"white"}} />
        <div style={{display:"flex", gap:8, marginTop:10, flexWrap:"wrap"}}>
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
