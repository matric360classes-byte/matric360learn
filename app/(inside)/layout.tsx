"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Logo(){
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800,fontSize:18}}>
      <img 
        src="/icon.png" 
        alt="Matric360"
        style={{width:32,height:32,borderRadius:8,objectFit:"contain"}}
        onError={(e)=>{
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <span>Matric360</span>
    </div>
  );
}

function LogoSmall(){
  return (
    <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800,fontSize:18}}>
      <img 
        src="/icon.png" 
        alt="M360"
        style={{width:30,height:30,borderRadius:8,objectFit:"contain"}}
        onError={(e)=>{
          const target = e.currentTarget as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <span>Matric360</span>
    </div>
  );
}

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

  const Item = ({label,href,icon}:{label:string,href:string,icon:string})=>{
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
      <aside style={{
        width:280, background:"#15172a", borderRight:"1px solid #252a44",
        position:"fixed", top:0,left:0,bottom:0, zIndex:60,
        transform: open? "translateX(0)" : "translateX(-100%)",
        transition:"0.25s ease", display:"flex",flexDirection:"column",
        overflowY:"auto"
      }}>
        <div style={{padding:"16px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #252a44"}}>
          <Logo />
          <button onClick={()=>setOpen(false)} style={{width:32,height:32,borderRadius:999,border:"2px solid #7c7cff",color:"#7c7cff",background:"transparent",cursor:"pointer"}}>✕</button>
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

        <div style={{flex:1, display:"flex", flexDirection:"column", minWidth:0, paddingBottom:80}}>
   <header style={{height:60, background:"#15172a", borderBottom:"1px solid #252a44", display:"flex", alignItems:"center", padding:"0 16px", gap:12, position:"sticky", top:0, zIndex:40}}>
     <button onClick={()=>setOpen(true)} style={{fontSize:22,background:"transparent",border:0,color:"#fff"}}>☰</button>
     {!open && <LogoSmall />}
     <div style={{marginLeft:"auto",fontSize:12,color:"#22c55e"}}>● Online</div>
   </header>
   <main style={{flex:1, paddingBottom:90}}>{children}</main>

   {/* BOTTOM MENU - SVG ICONS WIRED */}
   <div style={{position:"fixed",bottom:0,left:0,right:0,height:74,background:"#12131f",borderTop:"1px solid #252a44",display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:90,paddingBottom:"env(safe-area-inset-bottom)"}}>
     {[
       {href:"/dashboard",label:"Dashboard", d:"M3 12L12 3l9 9v8a1 1 0 0 1-1 1h-4V14H8v7H4a1 1 0 0 1-1-1z"},
       {href:"/subjects",label:"Subjects", d:"M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"},
       {href:"/exams",label:"Exams", d:"M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h6"},
       {href:"/progress",label:"Progress", d:"M18 20V10M12 20V4M6 20v-6"},
       {href:"/profile",label:"Profile", d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"},
     ].map(t=>{
       const active = (path||"").startsWith(t.href);
       const col = active ? "#7b7eff" : "#6b7280";
       return(
         <Link key={t.href} href={t.href} style={{textDecoration:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,minWidth:64}}>
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth={active?2.3:1.7} strokeLinecap="round" strokeLinejoin="round">
             {t.label==="Dashboard" && <path d={t.d} />}
             {t.label==="Subjects" && <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>}
             {t.label==="Exams" && <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2"/><path d="M9 12h6"/><path d="M9 16h6"/></>}
             {t.label==="Progress" && <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>}
             {t.label==="Profile" && <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
           </svg>
           <span style={{fontSize:10,fontWeight:active?800:600,color:col}}>{t.label}</span>
         </Link>
       )
     })}
   </div>
  </div>

      {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:55}}></div>}
    </div>
  );
}
