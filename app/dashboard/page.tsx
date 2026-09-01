"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardInside(){
  const [name,setName]=useState("Learner");
  const [active,setActive]=useState("Dashboard");
  const router=useRouter();

  useEffect(()=>{
    const n=localStorage.getItem("matric360_name");
    if(n && n!=="Mike Sibanda") setName(n);
  },[]);

  const logout=()=>{ localStorage.clear(); router.push("/"); };

  // WHAT SHOWS ON THE RIGHT WHEN YOU CLICK
  const renderContent=()=>{
    if(active==="Mathematics" || active==="Pure Maths"){
      return(<div><h1 style={{fontSize:28,fontWeight:900}}>Pure Mathematics</h1><p style={{color:"#94a3b8",marginTop:8}}>Inside app — not landing page.</p><div style={{marginTop:20,display:"grid",gap:12}}><div style={{background:"#151a33",border:"1px solid #1e2340",borderRadius:12,padding:16}}>Chapter 1: Algebra</div><div style={{background:"#151a33",border:"1px solid #1e2340",borderRadius:12,padding:16}}>Chapter 2: Calculus</div></div></div>)
    }
    if(active==="Physical Sciences"){
      return(<div><h1 style={{fontSize:28,fontWeight:900}}>Physical Sciences</h1><p style={{color:"#94a3b8",marginTop:8}}>Inside app — not landing page.</p><div style={{marginTop:20,display:"grid",gap:12}}><div style={{background:"#151a33",border:"1px solid #1e2340",borderRadius:12,padding:16}}>Chapter 1: Mechanics</div><div style={{background:"#151a33",border:"1px solid #1e2340",borderRadius:12,padding:16}}>Chapter 2: Electricity</div></div></div>)
    }
    // Default Dashboard
    return(
      <div>
        <h1 style={{fontSize:28,fontWeight:900}}>Welcome back, {name}!</h1>
        <p style={{color:"#94a3b8",marginTop:6}}>You are inside the app. Click a subject on the left.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:24}}>
          <div onClick={()=>setActive("Mathematics")} style={{cursor:"pointer",background:"#151a33",border:"1px solid #1e2340",borderRadius:16,padding:20}}><div style={{fontSize:28}}>∑</div><div style={{fontWeight:800,marginTop:8}}>Pure Mathematics</div><div style={{fontSize:12,color:"#818cf8",marginTop:6}}>Click to open →</div></div>
          <div onClick={()=>setActive("Physical Sciences")} style={{cursor:"pointer",background:"#151a33",border:"1px solid #1e2340",borderRadius:16,padding:20}}><div style={{fontSize:28}}>🎓</div><div style={{fontWeight:800,marginTop:8}}>Physical Science</div><div style={{fontSize:12,color:"#818cf8",marginTop:6}}>Click to open →</div></div>
        </div>
      </div>
    )
  };

  const btn = (label:string, icon:string, sub=false, danger=false)=>(
    <button onClick={()=> danger?logout():setActive(label)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",background: active===label?"#1c1f33":"transparent",color: danger?"#ef4444": active===label?"white":"#94a3b8",fontSize:14.5,marginLeft:sub?8:0}}>
      <span style={{width:20,textAlign:"center"}}>{icon}</span>{label}
    </button>
  );

  return(
    <div style={{minHeight:"100vh",background:"#0a0d1a",color:"white",display:"flex"}}>
      {/* SIDEBAR - INSIDE THE APP */}
      <div style={{width:280,background:"#13151f",borderRight:"1px solid #1e2235",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"18px 20px",borderBottom:"1px solid #1e2235",fontWeight:900,fontSize:20,display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:8,background:"#1e2235",display:"flex",alignItems:"center",justifyContent:"center"}}>M</div>Matric360</div>
        <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
          {btn("Dashboard","⌂")}
          {btn("Subjects","📖")}
          <div style={{fontSize:11,color:"#6b7280",padding:"16px 12px 8px",fontWeight:700,letterSpacing:1}}>SUBJECTS</div>
          {btn("Mathematics","∑",true)}
          {btn("Physical Sciences","🎓",true)}
          <div style={{height:1,background:"#1e2235",margin:"12px 0"}}></div>
          {btn("Mock Exams","📋")}
          {btn("Live Lessons","◉")}
          {btn("Announcements","📢")}
          {btn("Progress","📊")}
          {btn("Subscription","💳")}
          {btn("How to use Matric360","?")}
          {btn("Install Matric360","⬇")}
          {btn("Profile","👤")}
          {btn("Content Admin","🛡")}
          <div style={{height:1,background:"#1e2235",margin:"12px 0"}}></div>
          {btn("Logout","↪",false,true)}
        </div>
        <div style={{padding:14,borderTop:"1px solid #1e2235"}}><div style={{background:"#1a1e32",padding:12,borderRadius:12}}><div style={{fontWeight:700,fontSize:14}}>{name}</div><div style={{fontSize:11,color:"#64748b"}}>Inside App</div></div></div>
      </div>
      {/* RIGHT SIDE - CHANGES WHEN YOU CLICK */}
      <div style={{flex:1,padding:28,overflowY:"auto"}}>{renderContent()}</div>
    </div>
  )
}
