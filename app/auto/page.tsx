"use client";
import { useState } from "react";
export default function Auto(){
  const [log,setLog] = useState<string[]>(["Ready"]);
  const [running,setRunning] = useState(false);
  async function start(){
    setRunning(true);
    setLog(["Starting..."]);
    for(let i=0;i<135;i++){
      try{
        const r = await fetch('/api/generate',{method:'POST'});
        const d = await r.json();
        setLog(prev=>[`Batch ${i+1}: generated ${d.generated?? 0} | remaining ${d.remaining?? '?'} ${d.done?'ALL DONE!':''}`,...prev]);
        if(d.done){ setLog(prev=>[`🎉 ALL 675 DONE!`,...prev]); break; }
        if((d.generated?? 0)===0 && i>2){ setLog(prev=>[`⚠️ 0 generated - check GEMINI_API_KEY in Vercel!`,...prev]); break; }
        await new Promise(x=>setTimeout(x,4000));
      }catch(e){
        setLog(prev=>[`Error batch ${i+1}`,...prev]);
        await new Promise(x=>setTimeout(x,5000));
      }
    }
    setRunning(false);
  }
  return (
    <div style={{padding:20, background:'#000', color:'#0f0', minHeight:'100vh', fontFamily:'monospace'}}>
      <h1>Matric360 Auto - 675 Nodes</h1>
      <button onClick={start} disabled={running} style={{padding:15, fontSize:18, background: running?'gray':'#0f0', color:'#000'}}>
        {running? 'RUNNING - DO NOT CLOSE' : 'START GENERATE ALL 675'}
      </button>
      <div style={{marginTop:20}}>
        {log.map((l,i)=><div key={i} style={{padding:8, borderBottom:'1px solid #333'}}>{l}</div>)}
      </div>
    </div>
  )
}
