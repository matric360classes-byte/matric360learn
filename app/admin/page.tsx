"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

// PERMANENT FIX - Hardcoded to your GOOD project civwluydzbwqlnipmcmkhe
const supabase = createClient(
  "https://civwluydzbwqlnipmcmkhe.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AdminPage() {
  const [stats, setStats] = useState({ topics: 0, lessons: 0, questions: 0 });
  const [topics, setTopics] = useState<any[]>([]);
  const [showTopics, setShowTopics] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { count: tCount } = await supabase.from("topic_knowledge").select("*", { count: "exact", head: true });
      const { count: lCount } = await supabase.from("lesson_previews").select("*", { count: "exact", head: true });
      const { count: qCount } = await supabase.from("questions").select("*", { count: "exact", head: true }).catch(() => ({count: 0}));
      
      const { data: tData } = await supabase.from("topic_knowledge").select("id, caps_code").limit(20);
      
      setStats({ 
        topics: tCount || 0, 
        lessons: lCount || 0, 
        questions: (qCount as any) || 0 
      });
      setTopics(tData || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Content Admin — WIRED • Live</h1>
      <p className="text-sm opacity-70 mb-6">Supabase Live topic_knowledge: {stats.topics} • lessons: {stats.lessons} • questions: {stats.questions}</p>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div onClick={() => setShowTopics(!showTopics)} className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
          <p className="text-sm">Total Topics</p>
          <p className="text-3xl font-bold">{loading ? "..." : stats.topics}</p>
          <p className="text-xs text-blue-600 mt-2">Click to view →</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-sm">Lesson Previews</p>
          <p className="text-3xl font-bold">{loading ? "..." : stats.lessons}</p>
        </div>
        <div className="border p-4 rounded-lg">
          <p className="text-sm">Video Upload</p>
          <Link href="/admin/upload"><button className="mt-2 bg-black text-white px-3 py-1 rounded text-sm">Upload Video</button></Link>
        </div>
      </div>

      {showTopics && (
        <div className="border rounded-lg p-4">
          <h2 className="font-bold mb-3">All Topics ({topics.length})</h2>
          <div className="space-y-2">
            {topics.map((t) => (
              <div key={t.id} className="flex justify-between text-sm border-b py-2">
                <span>{t.caps_code}</span>
                <span className="opacity-50 text-xs">{t.id.slice(0,8)}...</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link href="/api/generate" className="text-sm underline">Go to Generator API</Link>
      </div>
    </div>
  );
}
