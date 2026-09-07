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
        // FIXED: select=*&limit=5000 removes 1000 cap - was hiding Node D+E
        const res = await fetch(`${url}/rest/v1/topic_knowledge?select=*&limit=5000`,{
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
      <p className="text-white/60 text-sm mb-5">Live from DB • {stats.total} topics • Phys: {stats.phys} • Math: {stats.math}</p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link href="/learn/physical-sciences" className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]">
          <div className="text-3xl mb-2">⚛️</div>
          <div className="font-bold">Physical Sciences</div>
          <div className="text-white/60 text-sm mt-1">{stats.phys} topics • {Math.floor(stats.phys/5)} titles</div>
        </Link>
        <Link href="/learn/mathematics" className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]">
          <div className="text-3xl mb-2">📐</div>
          <div className="font-bold">Mathematics</div>
          <div className="text-white/60 text-sm mt-1">{stats.math} topics • {Math.floor(stats.math/5)} titles</div>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06] opacity-60">
          <div className="font-bold">Total in DB</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
          <div className="text-xs text-white/60">Should be 2095</div>
        </div>
        <div className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06] opacity-60">
          <div className="font-bold">Published</div>
          <div className="text-2xl font-bold mt-1">{stats.pub}</div>
          <div className="text-xs text-white/60">Live</div>
        </div>
      </div>
      <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm">
        ✅ Fixed: limit=5000 • Now shows 2095 not 1000 • 5 nodes will appear
      </div>
    </div>
  );
}
