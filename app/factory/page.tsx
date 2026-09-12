"use client";
import { useEffect, useState } from "react";
export default function Factory(){
  const [stats, setStats] = useState<any>({queued:0, ready:0});
  const [logs, setLogs] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const loadStats = async()=>{
    const r = await fetch("/api/factory/stats");
    const j = await r.json();
    setStats(j);
  };
  useEffect(()=>{ loadStats(); },[]);

  const processAll = async()=>{
    setBusy(true);
    setLogs("Starting batch processing for all queued...\n");
    let total=0;
    while(true){
      const r = await fetch("/api/factory/process-all", {method:"POST"});
      const j = await r.json();
      if(j.error){ setLogs(l=>l+`\nERROR: ${j.error} ${j.lastError||""}`); break; }
      total+=j.processed||0;
      setLogs(l=>l+`\nBatch: processed ${j.processed} | remaining queued: ${j.remaining} | total: ${total}`);
      await loadStats();
      if(j.remaining===0 || j.processed===0) break;
      await new Promise(r=>setTimeout(r,2000));
    }
    setLogs(l=>l+`\n\nDONE. Total processed: ${total}`);
    setBusy(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Matric360 Factory - 419 Scale Ready</h1>
      <div className="flex gap-4 my-4">
        <div className="border p-4 rounded">Queued: {stats.queued}</div>
        <div className="border p-4 rounded">Ready: {stats.ready}</div>
        <div className="border p-4 rounded">Failed: {stats.failed||0}</div>
      </div>
      <button disabled={busy} onClick={processAll} className="bg-black text-white px-6 py-3 rounded disabled:opacity-50">
        {busy? "Processing..." : `Process All Queued (${stats.queued}) - No Limit`}
      </button>
      <pre className="mt-4 bg-gray-100 p-4 text-xs whitespace-pre-wrap h-64 overflow-auto">{logs}</pre>
    </div>
  );
}
