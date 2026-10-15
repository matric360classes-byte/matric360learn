"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AnnouncementsPage(){
  const [announcements,setAnnouncements]=useState<any[]>([]);
  const [userPlan,setUserPlan]=useState("free");

  useEffect(()=>{(async()=>{
    // Get user plan
    const { data: { user } } = await supabase.auth.getUser();
    if(user){
      const { data: profile } = await supabase.from("profiles").select("plan, is_premium").eq("id", user.id).single();
      if(profile?.plan==="premium" || profile?.is_premium) setUserPlan("premium");
      else setUserPlan("free");
    }
    // Get announcements
    const { data } = await supabase.from("announcements").select("*").eq("is_active", true).order("created_at",{ascending:false}).limit(50);
    if(data){
      setAnnouncements(data);
      // Mark as read - clear notification badge
      localStorage.setItem("last_announcement_seen", new Date().toISOString());
    }
  })()},[]);

  const visible = announcements.filter(a=>{
    if(a.audience==="all") return true;
    if(a.audience==="premium") return userPlan==="premium";
    if(a.audience==="free") return userPlan==="free";
    return true;
  });

  return(
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", padding:12, paddingBottom:90, fontFamily:"system-ui"}}>
      <h1 style={{fontSize:20, fontWeight:800}}>📢 Announcements</h1>
      <div style={{marginTop:12, display:"flex", flexDirection:"column", gap:12}}>
        {visible.length===0 && <div style={{background:"#1e1e28", padding:20, borderRadius:18, color:"#666"}}>No announcements yet.</div>}
        {visible.map(a=>(
          <div key={a.id} style={{background:"#1e1e28", borderRadius:18, padding:16, border:`1px solid ${a.audience==="premium"?"rgba(250,204,21,0.3)":"rgba(255,255,255,0.08)"}`}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <div style={{fontWeight:800}}>{a.title}</div>
              <span style={{fontSize:10, padding:"3px 8px", borderRadius:10, background: a.audience==="all"?"#162216":a.audience==="premium"?"#2a2416":"#1a2332", color: a.audience==="all"?"#22c55e":a.audience==="premium"?"#facc15":"#60a5fa"}}>{a.audience.toUpperCase()}</span>
            </div>
            <div style={{fontSize:13, color:"#d1d5db", marginTop:8, lineHeight:1.5}}>{a.message}</div>
            <div style={{fontSize:10, color:"#6b7280", marginTop:10}}>{new Date(a.created_at).toLocaleDateString()} • {new Date(a.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
