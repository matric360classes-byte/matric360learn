"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function LearnPage(){
  const [stats, setStats] = useState({ total:419, phys:252, math:167, pub:418 });
  useEffect(()=>{
    async function load(){
      try{
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        if(!url) return;
        const res = await fetch(`${url}/rest/v1/topic_knowledge?select=subject`,{
          headers:{ apikey:key, Authorization:`Bearer ${key}` }
        });
        const data = await res.json();
        if(Array.isArray(data) && data.length>0){
          const phys = data.filter((d:any)=>d.subject==='physical-sciences').length;
          const math = data.filter((d:any)=>d.subject==='mathematics').length;
          setStats({ total: data.length, phys, math, pub: data.length });
        }
      }catch(e){}
    }
    load();
  },[]);
  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-24">
      <h1 className="text-xl font-bold">Matric360</h1>
      <h2 className="text-2xl font-bold mt-6">CAPS Content Factory</h2>
      <p className="text-white/60 text-sm mb-5">Live from DB • {stats.total} topics</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]"><p className="text-sm text-white/60">Total topics</p><p className="text-3xl font-bold mt-2">{stats.total}</p></div>
        <div className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]"><p className="text-sm text-white/60">Published</p><p className="text-3xl font-bold mt-2 text-green-400">{stats.pub}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/learn/physical-sciences" className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]"><p className="font-bold">Physical Sciences</p><p className="text-2xl font-bold mt-4">{stats.phys}</p></Link>
        <Link href="/learn/mathematics" className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]"><p className="font-bold">Mathematics</p><p className="text-2xl font-bold mt-4">{stats.math}</p></Link>
      </div>
    </div>
  )
}
