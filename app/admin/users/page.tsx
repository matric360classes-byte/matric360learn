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
  const [search,setSearch]=useState("");
  const [roleFilter,setRoleFilter]=useState("All roles");
  const [planFilter,setPlanFilter]=useState("All plans");

  useEffect(()=>{(async()=>{
    let data:any[] = [];
    try{
      const { data: profiles } = await supabase.from("profiles").select("*").order("created_at",{ascending:false}).limit(500);
      if(profiles && profiles.length>0) data = profiles;
    }catch{}
    if(data.length===0){
      try{
        const { data: subs } = await supabase.from("subscriptions").select("*").order("created_at",{ascending:false}).limit(500);
        if(subs) data = subs;
      }catch{}
    }
    if(data.length===0){
      try{
        const { data: usersTable } = await supabase.from("users").select("*").order("created_at",{ascending:false}).limit(500);
        if(usersTable) data = usersTable;
      }catch{}
    }
    setUsers(data);
  })()},[]);

  // REAL COUNTS - NO HARDCODING
  const total = users.length;
  const premiumCount = users.filter((u:any)=> u.is_premium || u.plan==="premium" || u.subscription_status==="active").length;
  const superAdmins = users.filter((u:any)=> (u.role||"").toLowerCase().includes("super") || u.email==="megaluno28@gmail.com").length;
  const contentAdmins = users.filter((u:any)=> (u.role||"").toLowerCase().includes("content")).length;

  const filtered = users.filter((u:any)=>{
    const q = search.toLowerCase();
    const fullName = (u.full_name || u.name || "").toLowerCase();
    const email = (u.email || u.user_email || "").toLowerCase();
    const phone = (u.phone || "").toLowerCase();
    const matchesSearch =!q || fullName.includes(q) || email.includes(q) || phone.includes(q);

    const role = (u.role||"Student");
    const matchesRole = roleFilter==="All roles" || role===roleFilter || role.toLowerCase().includes(roleFilter.toLowerCase());

    const isPremium = u.is_premium || u.plan==="premium" || u.subscription_status==="active";
    const matchesPlan = planFilter==="All plans" || (planFilter==="Premium" && isPremium) || (planFilter==="Free" &&!isPremium);

    return matchesSearch && matchesRole && matchesPlan;
  });

  const fmt = (d:any)=> {
    try{ return d? new Date(d).toLocaleDateString("en-GB") : "-"; } catch{ return "-"; }
  };

  return (
    <div style={{minHeight:"100vh", background:"#0f0f14", color:"white", fontFamily:"system-ui", padding:12, paddingBottom:90}}>

      <div style={{display:"flex", alignItems:"center", gap:12, marginBottom:12}}>
        <button onClick={()=>router.push("/admin")} style={{background:"#1e1e28", border:"none", color:"white", borderRadius:12, width:40, height:40, cursor:"pointer"}}>←</button>
        <div style={{fontWeight:800, fontSize:18}}>Matric360</div>
        <div style={{marginLeft:"auto", display:"flex", gap:8}}>
          <span style={{fontSize:11, border:"1px solid #2a2a32", padding:"4px 10px", borderRadius:20}}>🛡 Content</span>
          <span style={{fontSize:11, border:"1px solid #2a2a32", padding:"4px 10px", borderRadius:20, color:"#22c55e"}}>● Online</span>
        </div>
      </div>

      {/* Content Admin mode - EXACT LIKE PIC */}
      <div style={{background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.35)",borderRadius:20,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:12,lineHeight:1.4}}>
          <span style={{color:"#22c55e",fontWeight:800}}>Content Admin mode</span>
          <span style={{color:"#9ca3af"}}> — lessons, videos, CAPS and the question bank. Payments, roles and system settings are restricted.</span>
        </div>
        <div style={{width:32,height:32,borderRadius:999,background:"#1e1e28",display:"grid",placeItems:"center"}}>☰</div>
      </div>

      <div style={{marginTop:12,background:"rgba(129,140,248,0.08)",border:"1px solid rgba(129,140,248,0.25)",borderRadius:20,padding:"14px 16px"}}>
        <div style={{fontSize:11,letterSpacing:1,color:"#818cf8",fontWeight:800}}>CONTENT ADMIN · USERS (READ ONLY)</div>
        <div style={{fontSize:11,color:"#9ca3af",marginTop:6,lineHeight:1.4}}>You can view learner and parent accounts to support content delivery. Role, premium and payment changes are restricted to Super Admins.</div>
      </div>

      {/* STATS - REAL NUMBERS */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginTop:12}}>
        {[
          ["USERS", total],
          ["PREMIUM", premiumCount],
          ["SUPER ADMINS", superAdmins],
          ["CONTENT ADMINS", contentAdmins],
        ].map(([label,val])=>(
          <div key={label as string} style={{background:"#1e1e28",border:"1px solid rgba(255,255,255,0.08)",borderRadius:18,padding:14}}>
            <div style={{fontSize:10,letterSpacing:1,color:"#9ca3af"}}>{label}</div>
            <div style={{fontSize:22,fontWeight:900,marginTop:6}}>{val}</div>
          </div>
        ))}
      </div>

      {/* SEARCH + DROPDOWNS - EXACT LIKE PIC */}
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <div style={{flex:1,background:"#1e1e28",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"0 14px",display:"flex",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, or phone" style={{width:"100%",background:"transparent",border:0,color:"white",padding:"12px 0",outline:"none",fontSize:13}} />
        </div>
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{background:"#1e1e28",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"white",padding:"10px 12px",fontSize:12}}>
          <option>All roles</option>
          <option>Student</option>
          <option>Parent</option>
          <option>Content Admin</option>
          <option>Super Admin</option>
        </select>
        <select value={planFilter} onChange={e=>setPlanFilter(e.target.value)} style={{background:"#1e1e28",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"white",padding:"10px 12px",fontSize:12}}>
          <option>All plans</option>
          <option>Free</option>
          <option>Premium</option>
        </select>
      </div>

      {/* USER CARDS - EXACT FORMAT LIKE YOUR PIC */}
      <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map((u:any)=>{
          // Name and surname if provided
          const displayName = u.full_name || u.name || u.first_name && u.last_name? `${u.first_name} ${u.last_name}` : (u.email||"").split("@")[0];
          const email = u.email || u.user_email || "";
          const phone = u.phone || u.phone_number || "";
          const isPremium = u.is_premium || u.plan==="premium" || u.subscription_status==="active";
          const joined = u.created_at || u.first_login;
          const lastLogin = u.last_sign_in_at || u.last_login_at || u.last_login || joined;

          return(
            <div key={u.id||email} style={{background:"#1e1e28",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"14px 16px"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                <div style={{fontWeight:700,fontSize:14}}>{displayName}</div>
                <span style={{fontSize:9,padding:"4px 8px",borderRadius:6,background:"#252538",color:"#9ca3af",border:"1px solid rgba(255,255,255,0.08)"}}>{u.role||"Student"}</span>
                <span style={{fontSize:9,padding:"4px 8px",borderRadius:6,background:"#252538",color:"#9ca3af",border:"1px solid rgba(255,255,255,0.08)"}}>{isPremium?"Premium":"Free"}</span>
                <span style={{fontSize:9,padding:"4px 8px",borderRadius:6,background:"#252538",color:"#9ca3af",border:"1px solid rgba(255,255,255,0.08)"}}>{u.status||"Active"}</span>
              </div>

              <div style={{display:"flex",justifyContent:"space-between",marginTop:8,gap:10, flexWrap:"wrap"}}>
                <div style={{minWidth:180}}>
                  <div style={{fontSize:12,color:"#9ca3af",display:"flex",alignItems:"center",gap:6}}>✉️ {email}</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Joined {fmt(joined)}</div>
                </div>
                <div style={{minWidth:120}}>
                  <div style={{fontSize:12,color:"#9ca3af",display:"flex",alignItems:"center",gap:6}}>📞 {phone || "—"}</div>
                  <div style={{fontSize:11,color:"#6b7280",marginTop:4}}>Last login {fmt(lastLogin)}</div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0 && <div style={{padding:20, color:"#666", background:"#1e1e28", borderRadius:18}}>No users found.</div>}
      </div>
    </div>
  );
}
