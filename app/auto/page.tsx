"use client";
import { useState } from "react";
export default function AutoPage(){
  const [log,setLog]=useState<string[]>([]);
  const [running,setRunning]=useState(false);
  const start=async()=>{
    setRunning(true);
    setLog(["Starting..."]);
    for(let i=0;i<70;i++){
      const res = await fetch("/api/batch-generate",{method:"POST"});
      const d = await res.json();
      setLog(prev=>[`Batch ${i+1}: generated ${d.generated} | remaining ${d.remaining} | err: ${d.lastError||'ok'}`,...prev]);
      if(d.remaining===0) break;
      if(d.generated===0 && i>2){ setLog(prev=>[`⚠️ 0 generated - check GEMINI_API_KEY in Vercel! Error: ${d.lastError}`,...prev]); break; }
    }
    setRunning(false);
  };
  return <div style={{background:"black",color:"#0f0",padding:20,minHeight:"100vh",fontFamily:"monospace"}}>
    <h1>Matric360 Auto - 135 Nodes (102 PDFs)</h1>
    <button onClick={start} disabled={running} style={{background:"#0f0",color:"black",padding:"15px 30px",fontSize:18,fontWeight:"bold",marginBottom:20}}>
      {running?"GENERATING...":"START GENERATE ALL 135"}
    </button>
    <div>{log.map((l,i)=><div key={i} style={{borderBottom:"1px solid #222",padding:"5px 0"}}>{l}</div>)}</div>
  </div>
}
