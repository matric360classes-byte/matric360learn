"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardInside(){
  const [name,setName]=useState("Learner");
  const router=useRouter();
  useEffect(()=>{ const n=localStorage.getItem("matric360_name"); if(n) setName(n); },[]);

  return(
    <div style={{padding:24}}>
      <h1 style={{fontSize:28,fontWeight:900}}>Welcome back, {name}! 👋</h1>
      <p style={{color:"#94a3b8",marginTop:6}}>You are inside the app — sidebar stays.</p>
      
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginTop:24}}>
        <div onClick={()=>router.push("/subjects/mathematics")} style={{cursor:"pointer",background:"#1a1e32",border:"1px solid #2a2e45",padding:20,borderRadius:16}}>
          <div style={{fontSize:22}}>📖</div>
          <div style={{fontWeight:800,marginTop:8}}>Pure Mathematics</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Your Units → Topics → 5 Nodes + YouTube</div>
        </div>
        <div onClick={()=>router.push("/subjects/physical-sciences")} style={{cursor:"pointer",background:"#1a1e32",border:"1px solid #2a2e45",padding:20,borderRadius:16}}>
          <div style={{fontSize:22}}>🎓</div>
          <div style={{fontWeight:800,marginTop:8}}>Physical Sciences</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Mechanics → Newton's Laws → 5 Nodes</div>
        </div>
      </div>

      <div style={{marginTop:24,background:"#13151f",border:"1px solid #1e2235",padding:16,borderRadius:12}}>
        <div style={{fontWeight:700}}>✅ Inside Layout Working</div>
        <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>Route: app/(inside)/dashboard — Sidebar is from layout.tsx, not from page</div>
      </div>
    </div>
  )
}
