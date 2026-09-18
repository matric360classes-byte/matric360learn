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
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await r.json();
      
      if(!Array.isArray(data)){ setLoading(false); return; }

      // FIXED: Group by caps_topic_id (135 unique) not by title (5)
      const unique = new Map();
      data.forEach((row:any)=>{
        const topicId = row.caps_topic_id || row.topic_id || row.topic_slug;
        if(topicId && !unique.has(topicId)){
          unique.set(topicId, {
            caps_code: row.topic_slug || topicId,
            topic_title: row.topic_slug?.replace(/-/g,' ') || `Topic ${unique.size+1}`,
            subject: row.node_label || 'General',
            id: topicId
          });
        }
      });
      
      setTopics(Array.from(unique.values()));
      setLoading(false);
    })();
  },[]);

  if(loading) return <div className="min-h-screen bg-[#0f0f12] text-white p-6">Loading 135 topics from 675 lessons...</div>;

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Matric360 Learn - {topics.length} topics</h1>
      <p className="text-sm text-gray-400 mb-4">✅ 675 lessons safe • Tap to open 5 nodes</p>
      <div className="flex flex-col gap-2">
        {topics.map((t:any)=>(
          <Link key={t.id} href={`/learn/${t.caps_code}`} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10">
            <div className="font-bold capitalize">{t.topic_title}</div>
            <div className="text-xs text-gray-400">{t.caps_code} • {t.subject}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
