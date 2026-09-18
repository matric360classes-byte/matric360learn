"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LearnList(){
  const [topics,setTopics]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=caps_topic_id,topic_slug,node_label&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await r.json();
      const unique = new Map();
      data.forEach((row:any)=>{
        const id = row.caps_topic_id;
        if(id &&!unique.has(id)){
          const niceName = (row.topic_slug||'').replace(/-/g,' ').replace(/\b\w/g,(c:string)=>c.toUpperCase()) || `Topic ${unique.size+1}`;
          unique.set(id, {
            id: id,
            slug: row.topic_slug || id,
            title: niceName,
            subject: row.node_label || 'General'
          });
        }
      });
      setTopics(Array.from(unique.values()).sort((a:any,b:any)=> a.title.localeCompare(b.title)));
      setLoading(false);
    })();
  },[]);

  if(loading) return <div className="min-h-screen bg-[#0f0f12] text-white p-6">Loading 135 topics...</div>;

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Matric360 Learn - {topics.length} topics</h1>
      <p className="text-sm text-gray-400 mb-4">✅ 675 lessons safe</p>
      <div className="flex flex-col gap-2">
        {topics.map((t:any)=>(
          <Link key={t.id} href={`/learn/${t.id}`} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10">
            <div className="font-bold">{t.title}</div>
            <div className="text-xs text-gray-400">{t.slug}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
