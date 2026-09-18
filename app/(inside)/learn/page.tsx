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
      // FIXED: fetch from learning_nodes with caps_code
      const r=await fetch(`${url}/rest/v1/learning_nodes?select=caps_code,topic_title,subject&limit=1000`,{
        headers:{apikey:key, Authorization:`Bearer ${key}`}
      });
      const data=await r.json();
      
      // FIXED: Group 675 nodes -> 135 unique topics
      const unique = new Map();
      if(Array.isArray(data)){
        data.forEach((row:any)=>{
          if(row.caps_code && !unique.has(row.caps_code)){
            unique.set(row.caps_code, row);
          }
        });
      }
      
      setTopics(Array.from(unique.values()).sort((a:any,b:any)=> a.subject.localeCompare(b.subject)));
      setLoading(false);
    })();
  },[]);

  if(loading) return <div className="min-h-screen bg-[#0f0f12] text-white p-6">Loading 135 topics...</div>;

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-24">
      <h1 className="text-2xl font-bold mb-2">Matric360 Learn - {topics.length} topics</h1>
      <p className="text-sm text-gray-400 mb-4">Tap any to open full lesson (5 nodes: Concept, Formulas, Examples, Traps, Practice)</p>
      <div className="flex flex-col gap-2">
        {topics.map(t=>(
          <Link key={t.caps_code} href={`/learn/${t.caps_code}`} className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10">
            <div className="font-bold">{t.topic_title}</div>
            <div className="text-xs text-gray-400">{t.caps_code} • {t.subject}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
