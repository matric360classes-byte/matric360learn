'use client'
import { useState } from 'react'
export default function FixAll(){
  const [logs,setLogs]=useState<string[]>([])
  const [running,setRunning]=useState(false)
  const [fixed,setFixed]=useState(0)
  const start=async()=>{
    setRunning(true)
    let total=0
    for(let b=0;b<100;b++){
      setLogs(l=>[...l.slice(-10), `Batch ${b} fetching...`])
      const res = await fetch(`/api/admin/fix-latex?batch=${b}`)
      const text = await res.text()
      try{
        const j = JSON.parse(text)
        total+=j.fixed||0
        setFixed(total)
        setLogs(l=>[...l.slice(-10), `B${b}: fixed ${j.fixed}/${j.processed}`])
        if(j.done || j.processed===0){ setLogs(l=>[...l, `DONE ${total}`]); break }
      }catch{
        setLogs(l=>[...l.slice(-10), `B${b} got HTML not JSON: ${text.slice(0,120)}...`])
        setLogs(l=>[...l, `STOP. Open in browser: /api/admin/fix-latex?batch=0 to see what it says`])
        break
      }
      await new Promise(r=>setTimeout(r,1200))
    }
    setRunning(false)
  }
  return(
    <div style={{padding:16, background:'#111', color:'#0f0', minHeight:'100vh', fontFamily:'monospace'}}>
      <h3>Fix 1000</h3>
      <div>Fixed: {fixed}</div>
      <button onClick={start} disabled={running} style={{padding:14, background:'#0f0', color:'#000', width:'100%', marginTop:10, borderRadius:8, fontWeight:'bold'}}>{running?'RUNNING':'START'}</button>
      <div style={{marginTop:12, background:'#000', padding:8}}>{logs.map((x,i)=><div key={i}>{x}</div>)}</div>
    </div>
  )
}
