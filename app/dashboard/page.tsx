"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage(){
  const [name,setName]=useState("Learner");
  const [stats,setStats]=useState({streak:1, xp:0, progress:48, dailyXp:0, dailyGoal:100, daysSince:4});
  const [menuOpen,setMenuOpen]=useState(false);

  useEffect(()=>{
    // 1. Try your saved name from signup
    const n = localStorage.getItem("matric360_name");
    const email = localStorage.getItem("matric360_email");
    const googleName = localStorage.getItem("matric360_google_name");
    const userStr = localStorage.getItem("matric360_user");

    if (googleName) {
      setName(googleName);
    } else if (n) {
      setName(n);
    } else if (userStr) {
      try {
        const u = JSON.parse(userStr);
        // Google user has full_name or name
        setName(u.full_name || u.name || u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || "Learner");
      } catch {
        if(email) setName(email.split('@')[0]);
      }
    } else if (email) {
      setName(email.split('@')[0]);
    }

    // 2. If using Supabase — get real logged in user (will override with real Google name)
    // @ts-ignore
    try {
      const supabaseKey = Object.keys(localStorage).find(k=>k.startsWith('sb-') && k.endsWith('-auth-token'));
      if(supabaseKey){
        const session = JSON.parse(localStorage.getItem(supabaseKey) || "{}");
        const realName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0];
        if(realName) setName(realName);
      }
    } catch {}
  },[]);

  return(
    <div style={{background:"#0e0e14",minHeight:"100vh",color:"white",paddingBottom:90}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"#0e0e14",position:"sticky",top:0,zIndex:20,borderBottom:"1px solid #1a1a26"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div onClick={()=>setMenuOpen(true)} style={{width:36,height:36,background:"#15151f",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>☰</div>
          <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800}}>
            <img src="/logo.png" alt="logo" style={{width:32,height:32,borderRadius:8}} />
            Matric360
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{background:"#15151f",border:"1px solid #242436",borderRadius:999,padding:"6px 12px",fontSize:12}}>🛡️ Content</div>
          <div style={{background:"#15151f",border:"1px solid #242436",borderRadius:999,padding:"6px 12px",fontSize:12,color:"#22c55e"}}>● Online</div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:50}}></div>
          <div style={{position:"fixed",top:0,left:0,bottom:0,width:"78%",maxWidth:320,background:"#10101a",zIndex:60,padding:"16px",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:10,fontWeight:800}}>
                <img src="/logo.png" alt="logo" style={{width:34,height:34,borderRadius:999}} />
                Matric360
              </div>
              <div onClick={()=>setMenuOpen(false)} style={{width:32,height:32,borderRadius:999,border:"1px solid #3a3a5a",display:"flex",alignItems:"center",justifyContent:"center",color:"#8b8cff",cursor:"pointer"}}>✕</div>
            </div>
            <Link href="/dashboard" style={{textDecoration:"none",color:"white",padding:"12px 8px",display:"flex",gap:12}}>⌂ Dashboard</Link>
            <Link href="/subjects" style={{textDecoration:"none",color:"white",padding:"12px 8px",display:"flex",gap:12}}>📖 Subjects</Link>
            <div style={{color:"#6b6d85",fontSize:11,margin:"12px 8px"}}>SUBJECTS</div>
            <Link href="/subjects/mathematics" style={{textDecoration:"none",color:"white",padding:"12px 8px",display:"flex",gap:12}}><span style={{color:"#7c6cff"}}>∑</span> Mathematics</Link>
            <Link href="/subjects/physical-sciences" style={{textDecoration:"none",color:"white",padding:"12px 8px",display:"flex",gap:12}}>🎓 Physical Sciences</Link>
            <div style={{height:1,background:"#1e1e2e",margin:"16px 0"}}></div>
            <Link href="/exams" style={{textDecoration:"none",color:"#c2c3d6",padding:"12px 8px",display:"flex",gap:12}}>📋 Mock Exams</Link>
            <Link href="/progress" style={{textDecoration:"none",color:"#c2c3d6",padding:"12px 8px",display:"flex",gap:12}}>📊 Progress</Link>
            <Link href="/profile" style={{textDecoration:"none",color:"#c2c3d6",padding:"12px 8px",display:"flex",gap:12}}>👤 Profile</Link>
          </div>
        </>
      )}

      <div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
        <div style={{color:"#8b8da3",fontSize:14}}>Welcome back</div>
        <div style={{fontSize:32,fontWeight:900}}>{name}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:18}}>
          <div style={{background:"#15151f",borderRadius:20,padding:14}}><div style={{fontSize:12,color:"#8b8da3"}}>🔥 Streak</div><div style={{fontSize:28,fontWeight:900,marginTop:8}}>{stats.streak} d</div></div>
          <div style={{background:"#15151f",borderRadius:20,padding:14}}><div style={{fontSize:12,color:"#8b8da3"}}>🏆 XP</div><div style={{fontSize:28,fontWeight:900,marginTop:8}}>{stats.xp}</div></div>
          <div style={{background:"#15151f",borderRadius:20,padding:14}}><div style={{fontSize:12,color:"#8b8da3"}}>✨ Progress</div><div style={{fontSize:28,fontWeight:900,marginTop:8}}>{stats.progress}%</div></div>
        </div>
        <Link href="/subjects/mathematics" style={{textDecoration:"none"}}><div style={{background:"#15151f",border:"1px solid #2a2a4a",borderRadius:20,padding:18,marginTop:16}}><div style={{fontSize:11,color:"#8b8cff",fontWeight:700}}>CONTINUE LEARNING</div><div style={{fontSize:20,fontWeight:800,marginTop:8,color:"white"}}>Arithmetic Sequences</div><div style={{fontSize:14,color:"#8b8da3",marginTop:4}}>Node A · Exam Hook</div></div></Link>
      </div>
    </div>
  )
}
