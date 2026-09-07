"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function SubjectLearnPage(){
  const { subject } = useParams() as { subject: string };
  const [topics, setTopics] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&select=*`,{
        headers:{ apikey:key, Authorization:`Bearer ${key}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setTopics(data);
    }
    if(subject) load();
  },[subject]);

  async function askTutor(){
    if(!question ||!selected) return;
    setLoading(true);
    setAnswer("");
    try{
      const res = await fetch("/api/tutor",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ subject, topic: selected.topic_name, caps_code: selected.caps_code, question })
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer");
    }catch(e:any){ setAnswer("Error: "+e.message); }
    setLoading(false);
  }

  return(
    <div className="min-h-screen bg-[#0f0f12] text-white p-4 pb-32">
      <Link href="/learn" className="text-sm text-white/60">← Back</Link>
      <h1 className="text-2xl font-bold capitalize mt-3">{subject?.replace("-", " ")}</h1>
      <p className="text-white/60 text-sm mt-1">{topics.length} CAPS topics loaded from DB ✅</p>

      {/* TOPICS GRID - neat dark pills like your style */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {topics.map((t:any)=>(
          <button key={t.caps_code} onClick={()=>setSelected(t)}
            className={`text-left bg-[#1c1c20] rounded-[20px] p-4 border ${selected?.caps_code===t.caps_code?'border-violet-500':'border-white/[0.06]'}`}>
            <p className="text-[11px] text-white/40">GRADE {t.grade} • {t.caps_code?.slice(0,12)}</p>
            <p className="font-semibold text-sm mt-1 line-clamp-2">{t.topic_name}</p>
          </button>
        ))}
      </div>

      {/* AI TUTOR BOX - appears when topic selected */}
      {selected && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1c1c20] border-t border-white/10 p-4 rounded-t-[24px]">
          <p className="text-xs text-white/40">ASK AI TUTOR — {selected.topic_name}</p>
          <div className="flex gap-2 mt-3">
            <input value={question} onChange={e=>setQuestion(e.target.value)}
              placeholder="Ask about this topic..."
              className="flex-1 bg-[#0f0f12] border border-white/10 rounded-full px-4 py-3 text-sm outline-none"/>
            <button onClick={askTutor} disabled={loading}
              className="bg-violet-600 px-5 rounded-full text-sm font-bold">{loading?"...":"Ask"}</button>
          </div>
          {answer && <div className="mt-3 bg-[#0f0f12] p-4 rounded-[16px] text-sm whitespace-pre-wrap max-h-[200px] overflow-y-auto">{answer}</div>}
        </div>
      )}
    </div>
  )
}
