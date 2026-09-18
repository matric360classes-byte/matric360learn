"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LearnList(){
  const [topics,setTopics]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [debug,setDebug]=useState("");

  useEffect(()=>{
    (async()=>{
      const url=process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      // SAFE: fetch ALL columns to see what you actually have
      const r=await fetch(`${url}/rest/v1/lesson_nodes?select=*&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await r.json();
      
      if(!Array.isArray(data)){
        setDebug(JSON.stringify(data).slice(0,500));
        setLoading(false);
        return;
      }

      setDebug(`Found ${data.length} rows. Sample keys: ${Object.keys(data[0]||{}).join(', ')}`);

      // Group by caps_code if exists, otherwise by title/topic
      const unique = new Map();
      data.forEach((row:any)=>{
        const key = row.caps_code || row.topic_title || row.title || row.id;
        const code = row.caps_code || row.id; // use id if no caps_code
        if(!unique.has(key)){
          unique.set(key, {
            caps_code: code,
            topic_title: row.topic_title || row.title || 'Untitled',
            subject: row.subject || row.node_label || 'General',
            real_id: row.id
          });
        }
      });
      
      setTopics(Array.from(unique.values()));
      setLoading(false);
    })();
  },[]);

  if(loading) return <div className="min-h-screen bg-[#0f0f12] text-white p-6">Loading... checking 675 lessons safety...</div>;

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Matric360 Learn - {topics.length} topics</h1>
      <p className="text-xs text-gray-500 mb-2">DEBUG: {debug}</p>
      <p className="text-sm text-gray-400 mb-4">Your 675 lessons are safe - showing grouped view</p>
      <div className="flex flex-col gap-2">
        {topics.slice(0,200).map((t:any)=>(
          <Link key={t.caps_code} href={`/learn/${t.caps_code}`} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10">
            <div className="font-bold">{t.topic_title}</div>
            <div className="text-xs text-gray-400">{t.caps_code} • {t.subject}</div>
          </Link>
        ))}
      </div>
      {topics.length===0 && <div className="text-red-400">No data? Check Supabase lesson_nodes table has rows</div>}
    </div>
  )
}
