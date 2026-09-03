"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function InsideLayout({children}:{children:React.ReactNode}){
  const [open,setOpen]=useState(false);
  const path = usePathname();

  const nav = [
    {label:"Dashboard", href:"/dashboard", icon:"⌂"},
    {label:"Subjects", href:"/subjects", icon:"📚"},
    {label:"Exams Hub", href:"/exams", icon:"📝"},
    {label:"Progress", href:"/progress", icon:"📈"},
    {label:"Profile", href:"/profile", icon:"👤"},
  ];

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#0f111e",color:"white"}}>
      {/* SIDEBAR */}
      <aside style={{
        width:260,
        background:"#15172a",
        borderRight:"1px solid #252a44",
        position:"fixed",
        top:0,left:0,bottom:0,
        zIndex:50,
        transform: open? "translateX(0)" : "translateX(-100%)",
        transition:"0.2s",
        display:"flex",
        flexDirection:"column"
      }} className="lg:!translate-x-0">
        {/* LOGO - ONLY HERE ON DESKTOP */}
        <div style={{padding:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #252a44"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800,fontSize:20}}>
            <img src="/icon.png" alt="M360" style={{width:36,height:36,borderRadius:8}} />
            Matric360
          </div>
          <button onClick={()=>setOpen(false)} className="lg:hidden" style={{color:"#9ca3af"}}>✕</button>
        </div>

        <div style={{padding:"12px",flex:1}}>
          {nav.map(n=>{
            const active = path.startsWith(n.href);
            return(
              <Link key={n.href} href={n.href} onClick={()=>setOpen(false)}
                style={{
                  display:"flex",gap:10,padding:"14px 14px",borderRadius:12,marginBottom:6,
                  background: active? "#232646" : "transparent",
                  color: active? "white" : "#9ca3af",
                  fontWeight: active? 700 : 400,
                  textDecoration:"none"
                }}>
                <span>{n.icon}</span> {n.label}
              </Link>
            )
          })}
        </div>
      </aside>

      {/* MAIN AREA */}
      <div style={{flex:1,marginLeft:0}} className="lg:ml-[260px]" id="main-wrapper">
        {/* TOP BAR - MOBILE ONLY LOGO */}
        <header style={{
          height:64,
          background:"#15172a",
          borderBottom:"1px solid #252a44",
          display:"flex",
          alignItems:"center",
          padding:"0 16px",
          gap:12,
          position:"sticky",
          top:0,
          zIndex:40
        }}>
          <button onClick={()=>setOpen(true)} className="lg:hidden" style={{fontSize:22}}>☰</button>

          {/* THIS LOGO SHOWS ONLY ON MOBILE - hidden on desktop */}
          <div className="flex lg:hidden" style={{display:"flex",alignItems:"center",gap:10,fontWeight:800}}>
            <img src="/icon.png" alt="M360" style={{width:30,height:30,borderRadius:8}} />
            Matric360
          </div>

          {/* DESKTOP: No logo here, empty spacer */}
          <div className="hidden lg:block"></div>
        </header>

        <main style={{padding:0}}>{children}</main>
      </div>

      {/* overlay */}
      {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:45}} className="lg:hidden"></div>}

      <style>{`
        @media(min-width: 1024px){
          aside{transform: translateX(0)!important;}
          #main-wrapper{margin-left:260px!important;}
          header.lg\\:hidden{display:none!important;}
         .lg\\:block{display:block!important;}
        }
      `}</style>
    </div>
  );
}
