"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function LearnPage(){
  const [stats,setStats]=useState({total:0,phys:0,math:0});
  useEffect(()=>{ (async()=>{
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL!; const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    let all:any[]=[]; let from=0; const step=1000;
    while(true){
      const r=await fetch(`${url}/rest/v1/topic_knowledge?select=*`,{headers:{apikey:key, Authorization:`Bearer ${key}`, Range:`${from}-${from+step-1}`}});
      const chunk=await r.json(); if(!Array.isArray(chunk)||chunk.length===0) break;
      all=all.concat(chunk); if(chunk.length<step) break; from+=step; if(from>5000) break;
    }
    setStats({total:all.length, phys:all.filter((d:any)=>d.subject==='physical-sciences').length, math:all.filter((d:any)=>d.subject==='mathematics').length});
  })(); },[]);
  return(<div className="min-h-screen bg-[#0f0f12] text-white p-4"><h1 className="font-bold">Matric360</h1><div className="grid grid-cols-2 gap-4 mt-6"><Link href="/learn/physical-sciences" className="bg-[#1c1c20] rounded-[24px] p-5 border">Physical Sciences<br/>{stats.phys} topics</Link><Link href="/learn/mathematics" className="bg-[#1c1c20] rounded-[24px] p-5 border">Mathematics<br/>{stats.math} topics</Link></div><div className="mt-6 p-3 bg-green-500/10 rounded">Should be 2095 total - currently {stats.total}</div></div>);
}
