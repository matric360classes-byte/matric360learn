"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InsideLayout({children}:{children:React.ReactNode}){
  const [open,setOpen]=useState(false);
  const path = usePathname();

  const mainNav = [
    {label:"Dashboard", href:"/dashboard", icon:"⌂"},
    {label:"Subjects", href:"/subjects", icon:"📖"},
  ];
  const subjectsNav = [
    {label:"Mathematics", href:"/subjects/mathematics", icon:"∑"},
    {label:"Physical Sciences", href:"/subjects/physical-sciences", icon:"🎓"},
  ];
  const toolsNav = [
    {label:"Mock Exams", href:"/exams/mock", icon:"📋"},
    {label:"Live Lessons", href:"/live", icon:"📡"},
    {label:"Announcements", href:"/announcements", icon:"📢"},
    {label:"Progress", href:"/progress", icon:"📊"},
    {label:"Subscription", href:"/subscription", icon:"💳"},
    {label:"How to use Matric360", href:"/help", icon:"❓"},
    {label:"Install Matric360", href:"/install", icon:"⬇"},
    {label:"Profile", href:"/profile", icon:"👤"},
    {label:"Content Admin", href:"/admin", icon:"🛡"},
  ];

  const Item = ({label,href,icon}:any)=>{
    const active = path===href;
    return(
      <Link href={href} onClick={()=>setOpen(false)} style={{
        display:"flex",gap:12,padding:"12px 16px",borderRadius:10,
        background: active? "#232646":"transparent",
        color: active? "white":"#cbd5e1",
        textDecoration:"none", fontSize:15
      }}>
        <span>{icon}</span> {label}
      </Link>
    )
  };

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#0f111e",color:"white"}}>
      {/* SIDEBAR DRAWER */}
      <aside style={{
        width:280, background:"#15172a", borderRight:"1px solid #252a44",
        position:"fixed", top:0,left:0,bottom:0, zIndex:60,
        transform: open? "translateX(0)" : "translateX(-100%)",
        transition:"0.25s ease", display:"flex",flexDirection:"column",
        overflowY:"auto"
      }}>
        <div style={{padding:"16px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #252a44"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800,fontSize:18}}>
            <img src="/icon.png" style={{width:32,height:32,borderRadius:8}} /> Matric360
          </div>
          <button onClick={()=>setOpen(false)} style={{width:32,height:32,borderRadius:999,border:"2px solid #7c7cff",color:"#7c7cff",background:"transparent"}}>✕</button>
        </div>

        <div style={{padding:"10px 8px"}}>
          {mainNav.map(n=><Item key={n.href} {...n} />)}

          <div style={{fontSize:11, color:"#6b7280", margin:"14px 0 6px 16px", letterSpacing:1}}>SUBJECTS</div>
          {subjectsNav.map(n=><Item key={n.href} {...n} />)}

          <div style={{height:1,background:"#252a44",margin:"14px 0"}} />

          {toolsNav.map(n=><Item key={n.href} {...n} />)}

          <div style={{height:1,background:"#252a44",margin:"14px 0"}} />
          <Link href="/logout" style={{display:"flex",gap:12,padding:"12px 16px",color:"#ef4444",textDecoration:"none"}}><span>↪</span> Logout</Link>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1, display:"flex", flexDirection:"column", minWidth:0}}>
        {/* TOP HEADER */}
        <header style={{height:60, background:"#15172a", borderBottom:"1px solid #252a44", display:"flex",alignItems:"center",padding:"0 16px",gap:12, position:"sticky",top:0,zIndex:30}}>
          <button onClick={()=>setOpen(true)} style={{fontSize:22,background:"transparent",border:0,color:"white"}}>☰</button>
          
          {/* LOGO IN TOP BAR - HIDE WHEN SIDEBAR OPEN */}
          {!open && (
            <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800,fontSize:18}}>
              <img 
  src="/logo.png" 
  alt="M360"
  onError={(e:any)=>{e.target.onerror=null; e.target.src="/icon.png"}}
  style={{width:32,height:32,borderRadius:8,objectFit:"contain",background:"#0f111e"}} 
/>
          )}
          <div style={{marginLeft:"auto",fontSize:12,color:"#22c55e"}}>● Online</div>
        </header>

        <main style={{flex:1}}>{children}</main>
      </div>

      {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:55}}></div>}
    </div>
  );
}
