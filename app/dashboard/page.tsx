  "use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage(){
  const router = useRouter();
  const [name,setName]=useState("Mike Sibanda");

  useEffect(()=>{
    const u = localStorage.getItem("matric360_user");
    const n = localStorage.getItem("matric360_name");
    if(n) setName(n);
    else if(u){
      try{
        const j=JSON.parse(u);
        if(j.name) setName(j.name);
      }catch{}
    }
  },[]);

  return(
    <div style={{background:"#fffce6",minHeight:"100vh",color:"#111",paddingBottom:80}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#fffce6",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontSize:22}}>☰</div>
          <div style={{fontWeight:900,display:"flex",alignItems:"center",gap:6}}><div style={{width:24,height:24,background:"#111",color:"#fbbf24",borderRadius:999,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>M</div> Matric360</div>
        </div>
        <div style={{fontSize:11,border:"1px solid #e5e7eb",borderRadius:999,padding:"6px 10px",background:"white"}}>● Online</div>
      </header>

      <div style={{padding:16,maxWidth:480,margin:"0 auto"}}>
        <div style={{color:"#6b7280",fontSize:13}}>Welcome back</div>
        <div style={{fontSize:30,fontWeight:900,color:"#7c5cff",marginTop:2}}>{name}</div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
          <div><div style={{fontSize:11,color:"#6b7280"}}>🔥 Streak</div><div style={{fontSize:28,fontWeight:900,color:"#7c5cff"}}>1<span style={{fontSize:14,color:"#6b7280"}}>d</span></div></div>
          <div><div style={{fontSize:11,color:"#6b7280"}}>⭐ XP</div><div style={{fontSize:28,fontWeight:900,color:"#7c5cff"}}>15945</div></div>
          <div><div style={{fontSize:11,color:"#6b7280"}}>📊 Progress</div><div style={{fontSize:28,fontWeight:900,color:"#7c5cff"}}>48%</div></div>
        </div>

        <div style={{background:"white",border:"1px solid #fde68a",borderRadius:16,padding:14,marginTop:20}}>
          <div style={{fontWeight:700,color:"#7c5cff",fontSize:14}}>You haven't studied in a while</div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>It's been 3 days. Jump back in — your unfinished lessons are highlighted below</div>
        </div>

        <div style={{background:"white",border:"1px solid #e5e7eb",borderRadius:16,padding:16,marginTop:20}}>
          <div style={{fontSize:10,color:"#9ca3af",fontWeight:700}}>CONTINUE LEARNING</div>
          <div style={{fontWeight:800,color:"#7c5cff",marginTop:6,fontSize:17}}>Arithmetic Sequences</div>
          <div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Node A • Exam Hook • Concepts</div>
        </div>

        <div style={{marginTop:20}}>
          <div style={{fontWeight:700}}>My Subjects (2)</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            <Link href="/subjects" style={{textDecoration:"none",background:"#111",color:"white",borderRadius:16,padding:14}}><div>📐</div><div style={{fontWeight:700,marginTop:6}}>Mathematics</div><div style={{fontSize:11,color:"#9ca3af"}}>13 Units</div></Link>
            <Link href="/subjects" style={{textDecoration:"none",background:"white",border:"1px solid #e5e7eb",borderRadius:16,padding:14,color:"#111"}}><div>⚗️</div><div style={{fontWeight:700,marginTop:6}}>Physical Sci</div><div style={{fontSize:11,color:"#9ca3af"}}>12 Units</div></Link>
          </div>
        </div>
      </div>

      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"space-around",padding:"10px 0"}}>
        <div style={{textAlign:"center",color:"#7c5cff"}}><div style={{fontSize:20}}>⌂</div><div style={{fontSize:11,fontWeight:700}}>Dashboard</div></div>
        <Link href="/subjects" style={{textDecoration:"none",textAlign:"center",color:"#9ca3af"}}><div style={{fontSize:20}}>📖</div><div style={{fontSize:11}}>Subjects</div></Link>
        <Link href="/exams" style={{textDecoration:"none",textAlign:"center",color:"#9ca3af"}}><div style={{fontSize:20}}>📋</div><div style={{fontSize:11}}>Exams</div></Link>
        <Link href="/progress" style={{textDecoration:"none",textAlign:"center",color:"#9ca3af"}}><div style={{fontSize:20}}>📊</div><div style={{fontSize:11}}>Progress</div></Link>
        <Link href="/profile" style={{textDecoration:"none",textAlign:"center",color:"#9ca3af"}}><div style={{fontSize:20}}>👤</div><div style={{fontSize:11}}>Profile</div></Link>
      </div>
    </div>
  )
}
