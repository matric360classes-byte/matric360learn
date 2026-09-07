"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Topic = { topic_name: string; grade: number; content: string; caps_code: string; }

export default function LearnPage(){
  const { subject } = useParams() as { subject: string };
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selected, setSelected] = useState<Topic | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    async function load(){
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      const res = await fetch(`${url}/rest/v1/topic_knowledge?subject=eq.${subject}&select=*&order=grade.asc`,{
        headers:{ "apikey": key, "Authorization": `Bearer ${key}` }
      });
      const data = await res.json();
      setTopics(data);
      if(data.length>0) setSelected(data[0]);
    }
    load();
  },[subject]);

  async function askAI(){
    if(!question ||!selected) return;
    setLoading(true);
    setAnswer("");
    try{
      const res = await fetch("/api/tutor",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          subject,
          topic: selected.topic_name,
          topic_content: selected.content,
          grade: selected.grade,
          question
        })
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer");
    }catch(e:any){
      setAnswer("Error: "+e.message);
    }
    setLoading(false);
  }

  return(
    <div className="min-h-screen bg-[#f8f9ff] p-4">
      <h1 className="text-2xl font-bold capitalize">{subject?.replace(/-/g,' ')} - AI Tutor</h1>
      <p className="text-sm text-gray-600">{topics.length} CAPS topics loaded from DB ✅</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {topics.map(t=>(
          <button key={t.caps_code} onClick={()=>setSelected(t)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${selected?.caps_code===t.caps_code?'bg-black text-white':'bg-white'}`}>
            G{t.grade}: {t.topic_name}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-4 bg-white p-4 rounded-2xl shadow">
          <h2 className="font-bold">{selected.topic_name} (Grade {selected.grade})</h2>
          <p className="text-sm text-gray-600 mt-1">CAPS Context: {selected.content}</p>

          <textarea value={question} onChange={e=>setQuestion(e.target.value)}
            placeholder={`Ask anything about ${selected.topic_name}... e.g. Explain Newton's 2nd law with example`}
            className="w-full mt-4 p-3 border rounded-xl text-sm h-24"/>

          <button onClick={askAI} disabled={loading}
            className="mt-2 bg-black text-white w-full py-3 rounded-full font-bold">
            {loading?'Thinking...':'Ask AI Tutor →'}
          </button>

          {answer && (
            <div className="mt-4 bg-[#f0f0ff] p-4 rounded-xl text-sm whitespace-pre-wrap">{answer}</div>
          )}
        </div>
      )}
    </div>
  )
}
