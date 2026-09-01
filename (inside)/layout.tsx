"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function InsideLayout({ children }: { children: React.ReactNode }){
  const [name,setName]=useState("Learner");
  const [open,setOpen]=useState(true);
  const router=useRouter();
  const pathname=usePathname();
  useEffect(()=>{ const n=localStorage.getItem("matric360_name"); if(n) setName(n); },[]);
  const go=(p:string)=>{ if(p==="/logout"){localStorage.clear();router.push("/");return;} router.push(p); if(window.innerWidth<768) setOpen(false); };
  const isActive=(p:string)=>pathname===p || pathname?.startsWith(p+"/");
  const Item=({l,p,i,sub,d}:{l:string,p:string,i:string,sub?:boolean,d?:boolean})=>(
    <button onClick={()=>go(p)} style={{width:"100%",display:"flex",gap:12,padding:"11px 12px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",background:isActive(p)?"#1c1f33":"transparent",color:d?"#ef4444":isActive(p)?"white":"#94a3b8",fontSize:14.5,marginLeft:sub?8:0}}><span style={{width:20}}>{i}</span>{l}</button>
  );
  return(
    <div style={{minHeight:"100vh",background:"#0a0a12",color:"white",display:"flex"}}>
      {open && <div style={{width:280,background:"#13151f",borderRight:"1px solid #1e2235",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0}}>
        <div style={{padding:"18px 20px",borderBottom:"1px solid #1e2235",fontWeight:900,fontSize:20,display:"flex",justifyContent:"space-between"}}><span>Matric360</span><button onClick={()=>setOpen(false)} style={{background:"transparent",border:"none",color:"#94a3b8",cursor:"pointer"}}>✕</button></div>
        <div style={{flex:1,overflowY:"auto",padding:12}}>
          <Item l="Dashboard" p="/dashboard" i="⌂" />
          <Item l="Subjects" p="/subjects" i="📖" />
          <div style={{fontSize:11,color:"#6b7280",padding:"16px 12px 8px",fontWeight:700}}>SUBJECTS</div>
          <Item l="Mathematics" p="/subjects/mathematics" i="∑" sub />
          <Item l="Physical Sciences" p="/subjects/physical-sciences" i="🎓" sub />
          <div style={{height:1,background:"#1e2235",margin:"12px 0"}}></div>
          <Item l="Mock Exams" p="/dashboard" i="📋" />
          <Item l="Live Lessons" p="/dashboard" i="◉" />
          <Item l="Announcements" p="/dashboard" i="📢" />
          <Item l="Progress" p="/dashboard" i="📊" />
          <Item l="Subscription" p="/dashboard" i="💳" />
          <Item l="How to use Matric360" p="/dashboard" i="?" />
          <Item l="Install Matric360" p="/dashboard" i="⬇" />
          <Item l="Profile" p="/dashboard" i="👤" />
          <Item l="Content Admin" p="/dashboard" i="🛡" />
          <div style={{height:1,background:"#1e2235",margin:"12px 0"}}></div>
          <Item l="Logout" p="/logout" i="↪" d />
        </div>
        <div style={{padding:14,borderTop:"1px solid #1e2235"}}><div style={{background:"#1a1e32",padding:12,borderRadius:12}}><div style={{fontWeight:700}}>{name}</div><div style={{fontSize:11,color:"#64748b"}}>Grade 12 • CAPS</div></div></div>
      </div>}
      <div style={{flex:1}}>
        <div style={{height:48,background:"#13151f",borderBottom:"1px solid #1e2235",display:"flex",alignItems:"center",padding:"0 16px",gap:12}}>
          {!open && <button onClick={()=>setOpen(true)} style={{background:"#1e2235",border:"none",color:"white",padding:"6px 10px",borderRadius:8,cursor:"pointer"}}>☰</button>}
          <span style={{fontWeight:700}}>Matric360</span>
        </div>
        <div style={{overflowY:"auto"}}>{children}</div>
      </div>
    </div>
  )
}
