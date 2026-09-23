"use client";
import { useEffect, useState } from "react";

type User = {
  id:string;
  name:string;
  email:string;
  phone:string;
  role:string;
  plan_name:string;
  plan_price:number;
  billing_cycle:string;
  subscription_status:string;
  created_at:string;
  last_login:string;
  subjects_count?:number;
}

export default function ContentAdminUsers(){
  const [users,setUsers]=useState<User[]>([]);
  const [search,setSearch]=useState("");
  const [roleFilter,setRoleFilter]=useState("All Roles");

  useEffect(()=>{
    // 1. Load real users from login/signup
    const storedUsers = JSON.parse(localStorage.getItem("matric360_all_users") || "[]")
    const currentPlan = JSON.parse(localStorage.getItem("matric360_plan") || "null")
    const currentEmail = localStorage.getItem("matric360_email")

    // 2. Update current logged user with his real plan (R2490 annual etc)
    let mergedUsers = storedUsers.map((u:any)=>{
      if(currentEmail && u.email===currentEmail && currentPlan){
        return {...u, ...currentPlan, last_login: new Date().toLocaleDateString()}
      }
      return u
    })

    // 3. If no users yet, show demo data
    if(mergedUsers.length===0){
      mergedUsers = [
        {
          id:"1",
          name:"Thobile Luthando Dlamini",
          email:"dlaminithobile491@gmail.com",
          phone:"+27 73 118 8782",
          role:"Student",
          plan_name:"FREE",
          plan_price:0,
          billing_cycle:"monthly",
          subscription_status:"Active",
          created_at:"23/09/2026",
          last_login:"23/09/2026",
        },
        {
          id:"2",
          name:"Amahle Ngwenya",
          email:"amahle@example.com",
          phone:"+27 82 123 4567",
          role:"Student",
          plan_name:"2 Subjects",
          plan_price:2490,
          billing_cycle:"annual",
          subscription_status:"active",
          created_at:"22/09/2026",
          last_login:"23/09/2026",
          subjects_count:2
        }
      ]
    }

    setUsers(mergedUsers)

    // 4. WHEN SUPABASE READY, UNCOMMENT THIS:
    // const fetchUsers = async () => {
    //   const {data} = await supabase.from('profiles').select('*').order('created_at',{ascending:false});
    //   if(data && data.length>0) setUsers(data);
    // }
    // fetchUsers();
  },[]);

  const filtered = users.filter(u=> {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter==="All Roles" || u.role===roleFilter
    return matchSearch && matchRole
  });

  return(
    <div style={{background:"#0a0d1a",minHeight:"100vh",color:"white",padding:"16px",paddingBottom:80}}>
      <h1 style={{fontWeight:900,fontSize:22}}>Content Admin - Users (Read Only)</h1>
      <p style={{color:"#94a3b8",fontSize:13,marginTop:4}}>Manage all {users.length} users in the system</p>
      
      <div style={{display:"flex",gap:10,marginTop:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search by name or email..." style={{flex:1,background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px",color:"white"}}/>
        <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:12,padding:"12px",color:"white"}}>
          <option>All Roles</option><option>Student</option><option>Parent</option>
        </select>
      </div>

      {filtered.length===0 && <div style={{textAlign:"center",color:"#64748b",marginTop:40}}>No users found. Try signing up first.</div>}

      <div style={{marginTop:16}}>
        {filtered.map(user=>(
          <div key={user.id} style={{background:"#1a1d2f",border:"1px solid #252a44",borderRadius:16,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{fontWeight:700,fontSize:14}}>{user.name}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                <span style={{fontSize:10,background:"#2a2d4a",padding:"4px 8px",borderRadius:999}}>{user.role}</span>
                <span style={{fontSize:10,background:user.plan_name==="FREE"?"#fbbf2420":"#10b98120",color:user.plan_name==="FREE"?"#fbbf24":"#10b981",padding:"4px 8px",borderRadius:999,fontWeight:800}}>{user.plan_name}</span>
                <span style={{fontSize:10,background:user.subscription_status.toLowerCase()==="active"?"#10b98120":"#2a2d4a",color:user.subscription_status.toLowerCase()==="active"?"#10b981":"#94a3b8",padding:"4px 8px",borderRadius:999}}>{user.subscription_status}</span>
              </div>
            </div>

            <div style={{fontSize:12,color:"#94a3b8",marginTop:8}}>📧 {user.email}</div>
            <div style={{fontSize:12,color:"#94a3b8"}}>📞 {user.phone}</div>

            <div style={{marginTop:8,background:"#131527",border:"1px solid #252a44",borderRadius:10,padding:"8px 10px"}}>
              <div style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>
                💳 {user.plan_name} • R{user.plan_price} {user.billing_cycle==="annual"? "/year" : "/mo"} {user.subjects_count? `• ${user.subjects_count} subjects` : ""}
              </div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:2}}>
                {user.billing_cycle==="annual" 
                  ? `Lump sum R${user.plan_price} • 2 months free (Pay 10, get 12)` 
                  : user.plan_name==="FREE" ? "R0/forever" : `R${user.plan_price}/month • Monthly`}
              </div>
            </div>

            <div style={{fontSize:11,color:"#6b7280",marginTop:8,display:"flex",justifyContent:"space-between"}}>
              <span>📅 Joined: {user.created_at}</span>
              <span>🕒 Last: {user.last_login}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
