"use client";
import { useEffect, useState } from "react";
export default function Factory(){
  const [stats, setStats] = useState<any>({queued:0, ready:0, failed:0});
  const [logs, setLogs] = useState(""); const [busy,setBusy]=useState(false);
  const load=async()=>{const r=await fetch("/api/factory/stats"); setStats(await r.json());};
  useEffect(()=>{load();},[]);
  const processAll=async()=>{
    setBusy(true); setLogs("Processing all queued - batches of 5, no limit...\n");
    let total=0;
    while(true){
      const r=await fetch("/api/factory/process-all",{method:"POST"}); const j=await r.json();
      if(j.error){setLogs(l=>l+`\nERROR: ${j.error} ${j.lastError||""}`); break;}
      total+=j.processed||0; setLogs(l=>l+`\n+${j.processed} processed | remaining ${j.remaining}`);
      if(j.remaining===0 || j.processed===0) break;
      await new Promise(r=>setTimeout(r,2000));
    }
    setBusy(false); load();
  };
  return (
    <div className="p-6"><h1 className="text-2xl font-bold">Factory - 419 Ready</h1>
      <div className="flex gap-3 my-4"><div className="border p-3 rounded">Queued: {stats.queued}</div><div className="border p-3 rounded">Ready: {stats.ready}</div><div className="border p-3 rounded">Failed: {stats.failed}</div></div>
      <button disabled={busy} onClick={processAll} className="bg-black text-white px-6 py-3 rounded font-bold">{busy?"Processing...":`Process All Queued (${stats.queued})`}</button>
      <pre className="mt-4 bg-gray-100 p-4 text-xs h-64 overflow-auto">{logs}</pre></div>
  );
}
