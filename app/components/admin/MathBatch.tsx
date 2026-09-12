"use client";
import { useState, useEffect } from "react";

export default function MathBatch(){
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [selTop, setSelTop] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeSubj, setActiveSubj] = useState<string>("All");

  const load = ()=>{
    fetch("/api/batch/scan").then(r=>r.json()).then(d=>{
      setPdfs(d.pdfs||[]);
      setTopics(d.topics||[]);
    });
  };

  useEffect(()=>{load()},[]);

  const subjects = ["All",...Array.from(new Set(topics.map((t:any)=>t.subject).filter(Boolean)))];

  const filteredTopics = activeSubj==="All"? topics : topics.filter((t:any)=>t.subject===activeSubj);

  const handleUpload = async(e:any)=>{
    const file = e.target.files[0]; if(!file) return;
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/kb/upload",{method:"POST", body:fd});
    const j = await res.json();
    setUploading(false);
    alert("Uploaded: "+ (j.name||file.name));
    load();
  };

  const queueToFactory = async()=>{
    if(selTop.size===0) return alert("Check at least 1 topic");
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
    const ids = filteredTopics.map((t:any)=>t.caps_code);
    const allSelected = ids.every((id:string)=>selTop.has(id));
    if(allSelected){
      const n=new Set(selTop); ids.forEach((id:string)=>n.delete(id)); setSelTop(n);
    } else {
      const n=new Set(selTop); ids.forEach((id:string)=>n.add(id)); setSelTop(n);
    }
  };

  return (
    <div className="p-6 pb-32">
      <h1 className="text-3xl font-bold">Batch - All Subjects + Bulk PDFs</h1>

      <div className="mt-4 flex gap-3 items-center flex-wrap">
        <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          {uploading?"Uploading...":"Upload PDF"}
          <input type="file" accept=".pdf" className="hidden" onChange={handleUpload}/>
        </label>
        <button onClick={load} className="bg-gray-200 px-4 py-2 rounded">Refresh</button>
      </div>

      <h2 className="mt-6 font-semibold">Step 1: Bulk Source PDFs ({pdfs.length} found)</h2>
      <div className="flex gap-2 flex-wrap mt-2">
        {pdfs.map((p:any)=><div key={p.name} className="border p-2 rounded bg-white text-sm">{p.name}</div>)}
      </div>

      <h2 className="mt-6 font-semibold flex gap-3 items-center flex-wrap">
        Step 2: All Subjects Topics ({filteredTopics.length} / {topics.length} found)
        <button onClick={toggleAll} className="text-sm bg-black text-white px-3 py-1 rounded">
          Toggle All {activeSubj}
        </button>
      </h2>

      <div className="flex gap-2 mt-3 flex-wrap">
        {subjects.map((s:any)=>(
          <button key={s} onClick={()=>setActiveSubj(s)} className={`px-3 py-1 rounded border text-sm ${activeSubj===s?"bg-black text-white":"bg-white"}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-2 mt-3">
        {filteredTopics.map((t:any)=>(
          <label key={t.caps_code} className="border p-3 rounded flex gap-3 items-center bg-white cursor-pointer hover:bg-gray-50">
            <input type="checkbox" checked={selTop.has(t.caps_code)} onChange={()=>{
              const n=new Set(selTop); n.has(t.caps_code)?n.delete(t.caps_code):n.add(t.caps_code); setSelTop(n);
            }} className="w-5 h-5"/>
            <span className="text-sm"><b>{t.subject}</b> | {t.topic_name} - Grade {t.grade} | {t.caps_code} | {t.status}</span>
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
