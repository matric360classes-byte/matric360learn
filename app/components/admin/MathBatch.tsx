"use client";
import { useState, useEffect } from "react";

export default function MathBatch(){
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selTop, setSelTop] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(()=>{
    fetch("/api/batch/scan").then(r=>r.json()).then(d=>{
      setPdfs(d.pdfs||[]); 
      setTopics(d.topics||[]);
    });
  },[]);

  const queueToFactory = async()=>{
    if(selTop.size===0) return alert("Check at least 1 topic in Step 2");
    setBusy(true);
    const selected = topics.filter((t:any)=>selTop.has(t.caps_code));
    const res = await fetch("/api/factory/queue-bulk",{
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({topics: selected})
    });
    const j = await res.json();
    setBusy(false);
    alert(`Queued ${j.queued} topics to Factory`);
    window.location.href="/admin/factory";
  };

  const toggleAll = ()=>{
    if(selTop.size===topics.length) setSelTop(new Set());
    else setSelTop(new Set(topics.map((t:any)=>t.caps_code)));
  };

  return (
    <div className="p-6 pb-32">
      <h1 className="text-3xl font-bold">Math Batch - Flat + Bulk PDFs</h1>
      
      <h2 className="mt-6 font-semibold">Step 1: Bulk Source PDFs ({pdfs.length} found)</h2>
      <div className="flex gap-2 flex-wrap mt-2">
        {pdfs.map((p:any)=><div key={p.name} className="border p-2 rounded bg-white">{p.name}</div>)}
      </div>

      <h2 className="mt-6 font-semibold flex gap-3 items-center">
        Step 2: Maths Topics Only ({topics.length} found)
        <button onClick={toggleAll} className="text-sm bg-black text-white px-3 py-1 rounded">
          {selTop.size===topics.length? "Uncheck All":"Check All 16"}
        </button>
      </h2>

      <div className="space-y-2 mt-3">
        {topics.map((t:any)=>(
          <label key={t.caps_code} className="border p-3 rounded flex gap-3 items-center bg-white cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={selTop.has(t.caps_code)} onChange={()=>{
              const n=new Set(selTop); n.has(t.caps_code)?n.delete(t.caps_code):n.add(t.caps_code); setSelTop(n);
            }} className="w-5 h-5"/>
            <span>{t.topic_name} - Grade {t.grade} | {t.caps_code} | {t.id?.slice(0,8)}</span>
          </label>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black p-4 flex justify-center gap-3 z-50">
        <button onClick={queueToFactory} disabled={busy} className="bg-white text-black px-8 py-3 rounded font-bold text-lg">
          {busy? "Queuing...":`Queue ${selTop.size} Selected → Factory`}
        </button>
        <button onClick={()=>location.href='/admin/factory'} className="bg-green-600 text-white px-8 py-3 rounded font-bold">
          Go to Factory
        </button>
      </div>
    </div>
  );
}
