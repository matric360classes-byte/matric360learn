"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
);

export default function AdminPage() {
  const [stats, setStats] = useState({ total: 0, topics: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: topics, count } = await supabase.from("topic_knowledge").select("*", { count: "exact" }).order("grade").order("topic_name");
      
      let lessons: any[] = [];
      let questions: any[] = [];
      try { const r = await supabase.from("lesson_previews").select("topic_id"); lessons = r.data || []; } catch {}
      try { const r = await supabase.from("questions").select("topic_id"); questions = r.data || []; } catch {}

      const qMap: any = {};
      questions.forEach((q: any) => { qMap[q.topic_id] = (qMap[q.topic_id] || 0) + 1; });

      const enriched = (topics || []).map((t: any) => ({
        ...t,
        hasLesson: lessons.some((l: any) => l.topic_id === t.id),
        qCount: qMap[t.id] || 0
      }));

      setStats({ total: count || topics?.length || 0, topics: enriched });
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{padding:20}}>Loading CAPS Factory... Found 16</div>;

  return (
    <div style={{padding:20, fontFamily:"sans-serif"}}>
      <h1>🎓 CAPS Factory - Total: {stats.total}</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:12}}>
        {stats.topics.map((t: any) => (
          <div key={t.id} style={{border:"1px solid #ddd", padding:12, borderRadius:8}}>
            <b>{t.topic_name}</b><br/>
            Grade {t.grade} • {t.subject}<br/>
            {t.hasLesson ? "✅ Lesson" : "❌ No Lesson"} • {t.qCount} Questions
          </div>
        ))}
      </div>
    </div>
  );
}
