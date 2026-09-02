"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function InsideLayout({ children }: { children: React.ReactNode }){
  const [name,setName]=useState("Learner");
  const [open,setOpen]=useState(false); // CLOSED on login like matric360app.co.za
  const router=useRouter();
  const pathname=usePathname();

  useEffect(()=>{ const n=localStorage.getItem("matric360_name"); if(n) setName(n); },[]);

  const go=(p:string)=>{ 
    if(p==="/logout"){localStorage.clear();router.push("/");return;} 
    setOpen(false);
    router.push(p); 
  };

  const isActive=(p:string)=>pathname===p || pathname?.startsWith(p+"/");

  const Item=({l,p,i,sub}:{l:string,p:string,i:string, sub?:boolean})=>(
    <button onClick={()=>go(p)} style={{width:"100%",display:"flex",gap:12,padding:"11px 12px",borderRadius:12,background:isActive(p)?"#1e2235":"transparent",color:isActive(p)?"white":"#a1a1aa",marginBottom:2, textAlign:"left", fontSize: sub?14:15, paddingLeft: sub?36:12, border:0, cursor:"pointer"}}>
      <span>{i}</span><span>{l}</span>
    </button>
  );

return(
  <div style={{minHeight:"100vh",background:"#0a0a12",color:"white",display:"flex",flexDirection:"column"}}>
    {/* TOP BAR WITH LOGO.PNG */}
    <div style={{height:56,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",background:"#13151f",borderBottom:"1px solid #1e2235",position:"sticky",top:0,zIndex:30}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setOpen(!open)} style={{fontSize:22, background:"transparent",border:0,color:"white", cursor:"pointer"}}>☰</button>
        <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:900}}>
          <img src="/logo.png" alt="Matric360" style={{width:32,height:32,borderRadius:8,objectFit:"contain",background:"white"}} onError={(e:any)=>{e.target.style.display="none"}} />
          Matric360
        </div>
      </div>
      <div style={{display:"flex",gap:8,fontSize:11}}>
        <span style={{padding:"4px 8px",borderRadius:999,background:"#ffffff1a"}}>○ Content</span>
        <span style={{padding:"4px 8px",borderRadius:999,background:"#10b98133",color:"#34d399"}}>◍ Online</span>
      </div>
    </div>

    <div style={{display:"flex",flex:1, position:"relative"}}>
      {/* SIDEBAR - CLOSED until ☰ clicked */}
      {open && <div style={{width:280,background:"#13151f",borderRight:"1px solid #1e2235",position:"fixed",top:56,bottom:70,left:0,zIndex:40,overflowY:"auto"}}>
        <div style={{padding:"18px 20px",borderBottom:"1px solid #1e2235",fontWeight:900,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src="/logo.png" alt="M" style={{width:28,height:28,borderRadius:6,objectFit:"contain",background:"white"}} />
            Matric360
          </div>
          <button onClick={()=>setOpen(false)} style={{background:"transparent",border:0,color:"white", cursor:"pointer"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:12}}>
          <Item l="Dashboard" p="/dashboard" i="⌂" />
          <Item l="Subjects" p="/subjects" i="📖" />
          <div style={{fontSize:11,color:"#6b7280",padding:"16px 12px 8px",fontWeight:700}}>SUBJECTS</div>
          <Item l="Mathematics" p="/subjects/mathematics" i="∑" sub />
          <Item l="Physical Sciences" p="/subjects/physical-sciences" i="ϟ" sub />
          <div style={{height:1,background:"#1e2235",margin:"12px 0"}}></div>
          <Item l="Mock Exams" p="/dashboard" i="📋" />
          <Item l="Live Lessons" p="/dashboard" i="◎" />
          <Item l="Announcements" p="/dashboard" i="📢" />
          <Item l="Progress" p="/progress" i="📊" />
          <Item l="Subscription" p="/dashboard" i="💳" />
          <Item l="How to use Matric360" p="/dashboard" i="?" />
          <Item l="Install Matric360" p="/dashboard" i="⬇" />
          <Item l="Profile" p="/profile" i="👤" />
          <Item l="Content Admin" p="/dashboard" i="🛡" />
        </div>
        <div style={{padding:12,borderTop:"1px solid #1e2235"}}>
          <button onClick={()=>go("/logout")} style={{width:"100%",display:"flex",gap:12,padding:"11px 12px",borderRadius:12,background:"transparent",color:"#ef4444",border:0,textAlign:"left", cursor:"pointer"}}>↪ Logout</button>
        </div>
      </div>}

      {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,top:56,background:"rgba(0,0,0,0.6)",zIndex:35}}></div>}

      <div style={{flex:1,padding:"16px",paddingBottom:90, minHeight:"calc(100vh - 126px)"}}>
        {children}
      </div>
    </div>

    {/* BOTTOM NAV - Dashboard, Subjects, Exams, Progress, Profile - clickable */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,height:70,background:"#13151f",borderTop:"1px solid #1e2235",display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:50}}>
      <button onClick={()=>go("/dashboard")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:pathname?.startsWith("/dashboard")?"#22d3ee":"#6b7280",background:"transparent",border:0, cursor:"pointer"}}><span style={{fontSize:18}}>⌂</span><span style={{fontSize:11}}>Dashboard</span></button>
      <button onClick={()=>go("/subjects")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:pathname?.startsWith("/subjects")?"#22d3ee":"#6b7280",background:"transparent",border:0, cursor:"pointer"}}><span style={{fontSize:18}}>📖</span><span style={{fontSize:11}}>Subjects</span></button>
      <button onClick={()=>go("/exams")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:pathname?.startsWith("/exams")?"#22d3ee":"#6b7280",background:"transparent",border:0, cursor:"pointer"}}><span style={{fontSize:18}}>📋</span><span style={{fontSize:11}}>Exams</span></button>
      <button onClick={()=>go("/progress")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:pathname?.startsWith("/progress")?"#22d3ee":"#6b7280",background:"transparent",border:0, cursor:"pointer"}}><span style={{fontSize:18}}>📊</span><span style={{fontSize:11}}>Progress</span></button>
      <button onClick={()=>go("/profile")} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,color:pathname?.startsWith("/profile")?"#22d3ee":"#6b7280",background:"transparent",border:0, cursor:"pointer"}}><span style={{fontSize:18}}>👤</span><span style={{fontSize:11}}>Profile</span></button>
    </div>
  </div>
);
}
