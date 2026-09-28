'use client'
import { useState } from 'react'

export default function FixAll(){
  const [logs, setLogs] = useState<string[]>(['Ready. Click START.'])
  const [running, setRunning] = useState(false)
  const [fixed, setFixed] = useState(0)
  const [batch, setBatch] = useState(0)

  const start = async()=>{
    setRunning(true)
    let b=0
    let total=0
    while(b<100){
      setBatch(b)
      setLogs(l=>[...l.slice(-12), `Batch ${b}...`])
      try{
        const r = await fetch(`/api/admin/fix-latex?batch=${b}`)
        const j = await r.json()
        total += j.fixed||0
        setFixed(total)
        setLogs(l=>[...l.slice(-12), `Batch ${b}: fixed ${j.fixed} / ${j.processed} (skipped ${j.skipped_already_perfect})`])
        if(j.done || j.processed===0){
          setLogs(l=>[...l, `DONE - ${total} fixed`])
          break
        }
        b++
        await new Promise(res=>setTimeout(res,1000))
      }catch(e:any){
        setLogs(l=>[...l, `Error batch ${b}: ${e.message}`])
        await new Promise(res=>setTimeout(res,2000))
      }
    }
    setRunning(false)
  }

  return(
    <div style={{padding:16, background:'#111', color:'#0f0', minHeight:'100vh', fontFamily:'monospace'}}>
      <h2>Fix 1000 - No F12 needed</h2>
      <div>Batch: {batch} | Total Fixed: {fixed}</div>
      <button onClick={start} disabled={running} style={{marginTop:12, padding:'14px', background: running?'#555':'#0f0', color:'#000', fontWeight:'bold', width:'100%', borderRadius:8, fontSize:16}}>
        {running? 'RUNNING... leave phone on' : 'START FIX ALL'}
      </button>
      <div style={{marginTop:16, background:'#000', padding:10, borderRadius:8}}>
        {logs.map((x,i)=><div key={i}>{x}</div>)}
      </div>
    </div>
  )
}
