"use client";
import { useEffect, useState } from "react";

export default function FactoryPage(){
  const [queued, setQueued] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState("");

  async function load(){
    const res = await fetch("/api/factory/generate");
    const j = await res.json();
    setQueued(j.queued||[]);
  }
  useEffect(()=>{load()},[]);

  async function processAll(){
    setProcessing(true);
    setResult("Processing 3 lessons... this takes 60-90 sec, don't close...");
    const res = await fetch("/api/factory/process-all",{method:"POST"});
    const j = await res.json();
    setResult(`✅ Done! Processed ${j.processed} lessons`);
    setProcessing(false);
    load();
  }

  return(
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Matric360 Factory - Lesson Generator</h1>
      <p className="mb-4">Queued: {queued.length} lessons</p>
      
      <button onClick={processAll} disabled={processing} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold w-full">
        {processing ? "⚙️ Processing 3 lessons..." : `🚀 Process All Queued (${queued.length})`}
      </button>
      {result && <p className="mt-4 p-3 bg-gray-100 rounded">{result}</p>}

      <div className="mt-6">
        {queued.map((q:any)=>(
          <div key={q.id} className="border p-3 rounded mb-2">
            <b>{q.topic_name}</b> - {q.caps_code} - {q.status}
          </div>
        ))}
      </div>
    </div>
  )
}
