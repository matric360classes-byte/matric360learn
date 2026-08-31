"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage(){
  const [name,setName]=useState("Mike Sibanda");
  // DYNAMIC - these will be calculated later from real progress
  const [stats,setStats]=useState({streak:1, xp:0, progress:0, dailyXp:0, dailyGoal:100, daysSince:4});
  const [subjects,setSubjects]=useState([
    {id:"mathematics", name:"Mathematics", units:16, progress:0},
    {id:"physical-sciences", name:"Physical Sciences", units:19, progress:0},
  ]);

  useEffect(()=>{
    const n = localStorage.getItem("matric360_name");
    const u = localStorage.getItem("matric360_user");
    if(n) setName(n);
    else if(u){ try{ const j=JSON.parse(u); if(j.name) setName(j.name);}catch{} }

    // Load dynamic stats if saved later
    const saved = localStorage.getItem("matric360_stats");
    if(saved){ try{ setStats(JSON.parse(saved)); }catch{} }
    const savedSubs = localStorage.getItem("matric360_subjects");
    if(savedSubs){ try{ setSubjects(JSON.parse(savedSubs)); }catch{} }
  },[]);

  const dailyPercent = Math.min(100, Math.round((stats.dailyXp / stats.dailyGoal)*100));

  return(
    <div style={{background:"#0e0e14",minHeight:"100vh",color:"white",paddingBottom:90}}>
      {/* HEADER */}
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"#0e0e14",position:"sticky",top:0,zIndex:10,borderBottom:"1px solid #1a1a26"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"#15151f",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center"}}>☰</div>
          <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:800}}><img src="/logo.png" alt="" style={{width:28,height:28,borderRadius:6,display:"none"}}/><div style={{width:28,height:28,background:"#7c6cff",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>M</div> Matric360</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{background:"#15151f",border:"1px solid #242436",borderRadius:999,padding:"6px 12px",fontSize:12,display:"flex",alignItems:"center",gap:6}}>🛡️ Content</div>
          <div style={{background:"#15151f",border:"1px solid #242436",borderRadius:999,padding:"6px 12px",fontSize:12,color:"#22c55e",display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,background:"#22c55e",borderRadius:999}}></span> Online</div>
        </div>
      </header>

      <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
        {/* WELCOME */}
        <div style={{color:"#8b8da3",fontSize:14}}>Welcome back</div>
        <div style={{fontSize:32,fontWeight:900,marginTop:2,letterSpacing:-0.5}}>{name}</div>

        {/* STREAK / XP / PROGRESS */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:18}}>
          <div style={{background:"#15151f",border:"1px solid #1e1e2e",borderRadius:20,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#8b8da3"}}><span style={{color:"#f97316"}}>🔥</span> Streak</div>
            <div style={{fontSize:28,fontWeight:900,marginTop:8}}>{stats.streak} <span style={{fontSize:14,fontWeight:400,color:"#8b8da3"}}>d</span></div>
          </div>
          <div style={{background:"#15151f",border:"1px solid #1e1e2e",borderRadius:20,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#8b8da3"}}><span style={{color:"#fbbf24"}}>🏆</span> XP</div>
            <div style={{fontSize:28,fontWeight:900,marginTop:8}}>{stats.xp}</div>
          </div>
          <div style={{background:"#15151f",border:"1px solid #1e1e2e",borderRadius:20,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#8b8da3"}}><span style={{color:"#7c6cff"}}>✨</span> Progress</div>
            <div style={{fontSize:28,fontWeight:900,marginTop:8}}>{stats.progress}%</div>
          </div>
        </div>

        {/* HAVEN'T STUDIED */}
        <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:20,padding:14,display:"flex",gap:12,marginTop:16}}>
          <div style={{width:28,height:28,borderRadius:999,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",display:"flex",alignItems:"center",justifyContent:"center",color:"#ef4444",flexShrink:0}}>!</div>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>You haven't studied in a while</div>
            <div style={{fontSize:13,color:"#9ca3af",marginTop:4,lineHeight:1.4}}>It's been {stats.daysSince} days. Jump back in — your unfinished lessons are highlighted below.</div>
          </div>
        </div>

        {/* DAILY GOAL */}
        <div style={{background:"#15151f",border:"1px solid #1e1e2e",borderRadius:20,padding:16,marginTop:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:700}}><span style={{color:"#7c6cff"}}>◎</span> Daily goal</div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:12,fontSize:13}}><div><b style={{fontSize:16}}>{stats.dailyXp}</b><span style={{color:"#8b8da3"}}> / {stats.dailyGoal} XP today</span></div><div style={{color:"#8b8da3"}}>{dailyPercent}%</div></div>
          <div style={{height:8,background:"#0e0e14",borderRadius:999,marginTop:10}}><div style={{width:`${dailyPercent}%`,height:"100%",background:"#6366f1",borderRadius:999,transition:"width 0.3s"}}></div></div>
          <div style={{fontSize:12,color:"#8b8da3",marginTop:10}}>Earn {Math.max(0, stats.dailyGoal - stats.dailyXp)} more XP to hit today's goal.</div>
        </div>

        {/* MILESTONES */}
        <div style={{background:"#15151f",border:"1px solid #1e1e2e",borderRadius:20,padding:16,marginTop:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:8,fontWeight:700}}><span style={{color:"#fbbf24"}}>🏅</span> Milestones</div><div style={{fontSize:12,color:"#8b8da3"}}>4 earned</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}}>
            <div style={{background:"#0e0e14",border:"1px solid #1e1e2e",borderRadius:999,padding:"10px 14px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><span style={{color:"#7c6cff"}}>📖</span> First lesson</div>
            <div style={{background:"#0e0e14",border:"1px solid #1e1e2e",borderRadius:999,padding:"10px 14px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><span style={{color:"#f97316"}}>🔥</span> First streak</div>
            <div style={{background:"#0e0e14",border:"1px solid #1e1e2e",borderRadius:999,padding:"10px 14px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><span style={{color:"#fbbf24"}}>⭐</span> First mastery</div>
            <div style={{background:"#0e0e14",border:"1px solid #1e1e2e",borderRadius:999,padding:"10px 14px",fontSize:13,display:"flex",alignItems:"center",gap:8}}><span style={{color:"#f97316"}}>🔥</span> 7-day streak</div>
          </div>
        </div>

        {/* CONTINUE LEARNING */}
        <Link href="/subjects/mathematics" style={{textDecoration:"none"}}>
          <div style={{background:"linear-gradient(180deg,#15151f,#1a1a2e)",border:"1px solid #2a2a4a",borderRadius:20,padding:18,marginTop:16}}>
            <div style={{fontSize:11,letterSpacing:1.5,color:"#8b8cff",fontWeight:700}}>CONTINUE LEARNING</div>
            <div style={{fontSize:20,fontWeight:800,marginTop:8,color:"white"}}>Arithmetic Sequences</div>
            <div style={{fontSize:14,color:"#8b8da3",marginTop:4}}>Node A · Exam Hook — Concepts</div>
            <div style={{marginTop:14,color:"#8b8cff",fontWeight:700,fontSize:14,display:"flex",alignItems:"center",gap:6}}>Resume <span>›</span></div>
          </div>
        </Link>

        {/* YOUR SUBJECTS - 2 ONLY */}
        <div style={{marginTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:700,color:"#c2c3d6"}}>Your subjects</div>
            <Link href="/subjects" style={{color:"#8b8cff",fontSize:13,textDecoration:"none"}}>See all</Link>
          </div>

          {subjects.map(s=>(
            <div key={s.id} style={{background:"#15151f",border:"1px solid #1e1e2e",borderRadius:20,padding:16,marginTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{display:"flex",gap:12}}>
                  <div style={{width:44,height:44,background:"#1e1e2e",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center"}}>📖</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:16}}>{s.name}</div>
                    <div style={{fontSize:12,color:"#8b8da3",marginTop:2}}>{s.units} units in progress</div>
                  </div>
                </div>
                <div style={{fontSize:14,color:"#c2c3d6",fontWeight:600}}>{s.progress}%</div>
              </div>
              <div style={{height:6,background:"#0e0e14",borderRadius:999,marginTop:12,overflow:"hidden"}}><div style={{width:`${s.progress}%`,height:"100%",background:"#6366f1"}}></div></div>
              <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
                <Link href={`/subjects/${s.id}`} style={{background:"#1e1e2e",borderRadius:999,padding:"8px 16px",fontSize:13,color:"#8b8cff",fontWeight:700,textDecoration:"none",display:"flex",alignItems:"center",gap:6}}>Continue <span>›</span></Link>
              </div>
            </div>
          ))}
        </div>

        {/* RECENTLY STUDIED */}
        <div style={{marginTop:20}}>
          <div style={{fontWeight:700,color:"#c2c3d6"}}>Recently studied</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
            {[
              {title:"Environmental Impact", sub:"Exam Challenge — Formulas & Checklist"},
              {title:"Environmental Impact", sub:"Exam Strategy"},
              {title:"Environmental Impact", sub:"Examiner Traps — Common Mistakes"},
            ].map((r,i)=>(
              <Link key={i} href="/subjects/physical-sciences" style={{textDecoration:"none",background:"#15151f",border:"1px solid #1e1e2e",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:600,fontSize:14,color:"white"}}>{r.title}</div><div style={{fontSize:12,color:"#8b8da3",marginTop:2}}>{r.sub}</div></div>
                <div style={{color:"#8b8da3"}}>›</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#11111a",borderTop:"1px solid #1e1e2e",display:"flex",justifyContent:"space-around",padding:"8px 0 10px"}}>
        <div style={{textAlign:"center",color:"#8b8cff"}}><div style={{fontSize:22}}>⌂</div><div style={{fontSize:11,fontWeight:700}}>Dashboard</div></div>
        <Link href="/subjects" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>📖</div><div style={{fontSize:11}}>Subjects</div></Link>
        <Link href="/exams" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>📋</div><div style={{fontSize:11}}>Exams</div></Link>
        <Link href="/progress" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>📊</div><div style={{fontSize:11}}>Progress</div></Link>
        <Link href="/profile" style={{textDecoration:"none",textAlign:"center",color:"#6b6d85"}}><div style={{fontSize:22}}>👤</div><div style={{fontSize:11}}>Profile</div></Link>
      </div>
    </div>
  )
}
