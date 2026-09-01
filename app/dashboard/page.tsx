"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard(){
  const [name,setName]=useState("Learner");
  const [active,setActive]=useState("Dashboard");
  const router = useRouter();

  useEffect(()=>{
    const n = localStorage.getItem("matric360_name");
    if(n && n !== "Mike Sibanda") setName(n);
  },[]);

  const menu = [
    { label:"Dashboard", icon:"⌂" },
    { label:"Subjects", icon:"📖" },
    { type:"title", label:"SUBJECTS" },
    { label:"Mathematics", icon:"∑", sub:true },
    { label:"Physical Sciences", icon:"🎓", sub:true },
    { type:"divider" },
    { label:"Mock Exams", icon:"📋" },
    { label:"Live Lessons", icon:"◉" },
    { label:"Announcements", icon:"📢" },
    { label:"Progress", icon:"📊" },
    { label:"Subscription", icon:"💳" },
    { label:"How to use Matric360", icon:"?" },
    { label:"Install Matric360", icon:"⬇" },
    { label:"Profile", icon:"👤" },
    { label:"Content Admin", icon:"🛡" },
    { type:"divider" },
    { label:"Logout", icon:"↪", danger:true },
  ];

  const handleClick = (label:string, danger?:boolean)=>{
    if(danger){
      localStorage.clear();
      router.push("/");
      return;
    }
    setActive(label);
    // Later we will make each one go to real page:
    // router.push(`/${label.toLowerCase().replace(/ /g,"-")}`)
  };

  return(
    <div style={{minHeight:"100vh",background:"#0a0d1a",color:"white",display:"flex"}}>
      {/* SIDEBAR - Exactly like your screenshot */}
      <div style={{width:280,background:"#13151f",borderRight:"1px solid #1e2235",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
        {/* Header */}
        <div style={{padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1e2235"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:900,fontSize:20}}>
            <div style={{width:32,height:32,borderRadius:8,background:"#1e2235",display:"flex",alignItems:"center",justifyContent:"center"}}>M</div>
            Matric360
          </div>
          <div style={{width:28,height:28,borderRadius:14,border:"1px solid #4f46e5",display:"flex",alignItems:"center",justifyContent:"center",color:"#6366f1"}}>✕</div>
        </div>

        {/* Menu */}
        <div style={{flex:1,overflowY:"auto",padding:"12px 12px"}}>
          {menu.map((item:any, i)=>{
            if(item.type==="title") return <div key={i} style={{fontSize:11,letterSpacing:1,color:"#6b7280",padding:"16px 12px 8px",fontWeight:700}}>{item.label}</div>
            if(item.type==="divider") return <div key={i} style={{height:1,background:"#1e2235",margin:"12px 0"}}></div>
            const isActive = active===item.label;
            return(
              <button key={i} onClick={()=>handleClick(item.label,item.danger)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",background:isActive?"#1c1f33":"transparent",color:item.danger?"#ef4444": isActive ?"white":"#94a3b8",fontSize:15,marginLeft:item.sub?8:0}}>
                <span style={{width:20,textAlign:"center",color:item.danger?"#ef4444":isActive?"#818cf8":"#64748b"}}>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </div>

        <div style={{padding:14,borderTop:"1px solid #1e2235"}}>
          <div style={{background:"#1a1e32",padding:12,borderRadius:12}}>
            <div style={{fontWeight:700,fontSize:14}}>{name}</div>
            <div style={{fontSize:11,color:"#64748b"}}>Pure Maths + Physical Science</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - Inside landing after login */}
      <div style={{flex:1,padding:28,overflowY:"auto"}}>
        <h1 style={{fontSize:28,fontWeight:900}}>Welcome back, {name}!</h1>
        <p style={{color:"#94a3b8",marginTop:6}}>You are in {active}</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:24}}>
          <div style={{background:"#151a33",border:"1px solid #1e2340",borderRadius:16,padding:20}}>
            <div style={{fontSize:28}}>∑</div>
            <div style={{fontWeight:800,marginTop:8}}>Pure Mathematics</div>
            <div style={{height:6,background:"#0a0d1a",borderRadius:10,marginTop:12}}><div style={{width:"48%",height:6,background:"#818cf8",borderRadius:10}}></div></div>
            <div style={{fontSize:12,color:"#64748b",marginTop:8}}>48% progress</div>
          </div>
          <div style={{background:"#151a33",border:"1px solid #1e2340",borderRadius:16,padding:20}}>
            <div style={{fontSize:28}}>🎓</div>
            <div style={{fontWeight:800,marginTop:8}}>Physical Sciences</div>
            <div style={{height:6,background:"#0a0d1a",borderRadius:10,marginTop:12}}><div style={{width:"35%",height:6,background:"#c4b5fd",borderRadius:10}}></div></div>
            <div style={{fontSize:12,color:"#64748b",marginTop:8}}>35% progress</div>
          </div>
        </div>

        <div style={{marginTop:24,background:"#151a33",border:"1px solid #1e2340",borderRadius:16,padding:20}}>
          <div style={{fontWeight:700}}>Ready to make clickable?</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:6}}>Right now clicking sidebar changes the title. Later we will make each button go to `/subjects`, `/mock-exams`, etc. Just tell me which one you want to build next.</div>
        </div>
      </div>
    </div>
  )
}
