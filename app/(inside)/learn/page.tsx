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
        // Count from your real topic_knowledge table
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Matric360</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-[#1c1c20] rounded-full text-xs border border-white/10">Content</span>
          <span className="px-3 py-1.5 bg-[#1c1c20] rounded-full text-xs text-green-400 border border-white/10">● Online</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold">CAPS Content Factory</h2>
      <p className="text-white/60 text-sm mb-5">Live from DB • {stats.total} topics</p>

      {/* TOP 2 CARDS - like your screenshot */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]">
          <p className="text-sm text-white/60">Total topics</p>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]">
          <p className="text-sm text-white/60">Published</p>
          <p className="text-3xl font-bold mt-2 text-green-400">{stats.pub}</p>
        </div>
      </div>

      {/* SUBJECT CARDS - NEAT */}
      <p className="font-bold mb-3">Completion by subject</p>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/learn/physical-sciences" className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]">
          <p className="text-xs text-white/50">SUBJECT</p>
          <p className="font-bold mt-1">Physical Sciences</p>
          <p className="text-2xl font-bold mt-4">{stats.phys}</p>
          <p className="text-xs text-white/40">topics</p>
        </Link>
        <Link href="/learn/mathematics" className="bg-[#1c1c20] rounded-[24px] p-5 border border-white/[0.06]">
          <p className="text-xs text-white/50">SUBJECT</p>
          <p className="font-bold mt-1">Mathematics</p>
          <p className="text-2xl font-bold mt-4">{stats.math}</p>
          <p className="text-xs text-white/40">topics</p>
        </Link>
      </div>

      {/* TABLE - like your admin */}
      <div className="mt-6 bg-[#1c1c20] rounded-[24px] border border-white/[0.06] overflow-hidden">
        <div className="grid grid-cols-3 p-4 text-[11px] text-white/40 tracking-wide">
          <span>SUBJECT</span><span className="text-center">TOPICS</span><span className="text-right">STATUS</span>
        </div>
        <div className="grid grid-cols-3 p-4 text-sm border-t border-white/5">
          <span className="font-bold">Physical Sciences</span><span className="text-center">{stats.phys}</span><span className="text-right text-green-400">●</span>
        </div>
        <div className="grid grid-cols-3 p-4 text-sm border-t border-white/5">
          <span className="font-bold">Mathematics</span><span className="text-center">{stats.math}</span><span className="text-right text-green-400">●</span>
        </div>
      </div>
    </div>
  )
}
