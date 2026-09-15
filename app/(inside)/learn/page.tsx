"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LearnPage(){
  const [stats,setStats]=useState({total:0,phys:0,math:0});
  const [nodes,setNodes]=useState<any[]>([]);

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!; 
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const all=await r.json();
      if(Array.isArray(all)){
        setNodes(all);
        setStats({
          total:all.length, 
          phys:all.filter((d:any)=> d.title?.toLowerCase().includes('phys') || d.node_label?.includes('physical')).length,
          math:all.filter((d:any)=> d.title?.toLowerCase().includes('math') || d.subject==='mathematics').length
        });
      }
    })();
  },[]);

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4">
      <h1 className="font-bold text-2xl">Matric360 Learn - {stats.total} topics</h1>
      <p className="text-gray-400">Physical Sciences: {stats.phys} | Math: {stats.math}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        {nodes.map((n:any)=>(
          <Link key={n.id} href={`/l/${n.id}`} className="p-3 bg-white/10 rounded hover:bg-white/20">
            <div className="font-bold">{n.title}</div>
            <div className="text-xs text-gray-400">{n.node_label} - {(n.content?.body_markdown?.length||0)} chars</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
