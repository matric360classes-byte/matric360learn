"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function UsersPage(){
  const router = useRouter();
  const [users,setUsers]=useState<any[]>([]);
  const [filter,setFilter]=useState("all");

  useEffect(()=>{(async()=>{
    // Try profiles, fall back to auth users, subscriptions
    let data:any[] = [];
    try{
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at",{ascending:false}).limit(200);
      if(profiles && profiles.length>0) data = profiles;
    }catch{}
    
    if(data.length===0){
      try{
        const { data: subs } = await supabase.from("subscriptions").select("*").order("created_at",{ascending:false}).limit(200);
        if(subs) data = subs;
      }catch{}
    }
    
    if(data.length===0){
      try{
        const { data: usersTable } = await supabase.from("users").select("*").order("created_at",{ascending:false}).limit(200);
        if(usersTable) data = usersTable;
      }catch{}
    }

    setUsers(data);
  })()},[]);

  const filtered = users.filter((u:any)=>{
    if(filter==="premium") return u.is_premium || u.plan==="premium" || u.subscription_status==="active";
    if(filter==="free") return !u.is_premium && u.plan!=="premium";
    return true;
  });

  return (
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui", padding:12, paddingBottom:80}}>
      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:16}}>
        <button onClick={()=>router.push("/admin")} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:12, width:40, height:40}}>←</button>
        <h1 style={{margin:0, fontSize:20, fontWeight:"800"}}>Users</h1>
        <span style={{background:"#1e1e28", padding:"4px 10px", borderRadius:20, fontSize:12}}>{users.length} total</span>
      </div>

      <div style={{display:"flex", gap:8, marginBottom:16}}>
        {[
          ["all","All"],
          ["premium","Premium"],
          ["free","Free"]
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"8px 16px", borderRadius:20, border:"none", background: filter===k ? "#8b7cf8" : "#1c1c24", color: filter===k ? "black" : "white", fontWeight:"bold"}}>{l}</button>
        ))}
      </div>

      <div style={{background:"#1c1c24", borderRadius:20, overflow:"hidden"}}>
        <div style={{display:"grid", gridTemplateColumns:"1.5fr 0.8fr 0.8fr 0.9fr 0.9fr", padding:12, color:"#9ca3af", fontSize:11, fontWeight:"bold", borderBottom:"1px solid #222"}}>
          <span>USER</span><span>PLAN</span><span>FIRST LOGIN</span><span>LAST LOGIN</span><span>PREMIUM EXPIRES</span>
        </div>
        {filtered.map((u:any)=>(
          <div key={u.id||u.email} style={{display:"grid", gridTemplateColumns:"1.5fr 0.8fr 0.8fr 0.9fr 0.9fr", padding:12, borderTop:"1px solid #222", fontSize:12}}>
            <div>
              <div style={{fontWeight:"bold"}}>{u.email || u.user_email || u.name || "No email"}</div>
              <div style={{color:"#9ca3af", fontSize:10}}>{u.id?.slice(0,8)} • {u.full_name||""}</div>
            </div>
            <div>
              {(u.is_premium || u.plan==="premium" || u.subscription_status==="active") ? 
                <span style={{background:"#22c55e", color:"black", padding:"2px 8px", borderRadius:10, fontSize:10, fontWeight:"800"}}>PREMIUM</span> : 
                <span style={{background:"#2a2a32", color:"#9ca3af", padding:"2px 8px", borderRadius:10, fontSize:10}}>FREE</span>}
            </div>
            <div>{u.created_at ? new Date(u.created_at).toLocaleDateString() : u.first_login ? new Date(u.first_login).toLocaleDateString() : "-"}</div>
            <div>{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : u.last_login ? new Date(u.last_login).toLocaleDateString() : "-"}</div>
            <div style={{color: u.premium_expires_at && new Date(u.premium_expires_at) < new Date() ? "#ef4444" : "#22c55e"}}>
              {u.premium_expires_at ? new Date(u.premium_expires_at).toLocaleDateString() : u.expires_at ? new Date(u.expires_at).toLocaleDateString() : u.premium_until ? new Date(u.premium_until).toLocaleDateString() : "-"}
            </div>
          </div>
        ))}
        {filtered.length===0 && <div style={{padding:20, color:"#666"}}>No users found in profiles table. Will show automatically when users sign up.</div>}
      </div>

      <div style={{marginTop:16, background:"#162216", padding:12, borderRadius:16, fontSize:11, color:"#9ca3af"}}>
        <b style={{color:"#22c55e"}}>Wired to Supabase:</b> Reading from profiles / users / subscriptions. Shows free vs premium, first login (created_at), last login (last_sign_in_at), premium expiry.
      </div>
    </div>
  );
}
