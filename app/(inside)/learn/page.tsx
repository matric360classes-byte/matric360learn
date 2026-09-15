"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LearnList(){
  const [nodes,setNodes]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=id,title,node_label,content&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await r.json();
      setNodes(Array.isArray(data)? data : []);
      setLoading(false);
    })();
  },[]);

  if(loading) return <div className="min-h-screen bg-[#0f0f12] text-white p-6">Loading 135 topics...</div>;

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Matric360 Learn - {nodes.length} topics</h1>
      <p className="text-sm text-gray-400 mb-4">Tap any to open full lesson</p>
      <div className="flex flex-col gap-2">
        {nodes.map(n=>{
          const chars = n.content?.body_markdown?.length || JSON.stringify(n.content||"").length;
          return(
            <Link key={n.id} href={`/learn/${n.id}`} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10">
              <div className="font-bold">{n.title}</div>
              <div className="text-xs text-gray-400">{n.node_label} - {chars} chars</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
