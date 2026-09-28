'use client'
import { useState } from 'react'

export default function FixAllPage(){
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(0)
  const [fixed, setFixed] = useState(0)

  const start = async () => {
    setRunning(true)
    setLog([])
    let batch = 0
    let totalFixed = 0
    while(true){
      setLog(prev=>[...prev, `Batch ${batch}: fixing...`])
      try{
        const res = await fetch(`/api/admin/fix-latex?batch=${batch}`)
        const data = await res.json()
        totalFixed += data.fixed || 0
        setFixed(totalFixed)
        setDone(batch*12 + data.processed)
        setLog(prev=>[...prev.slice(-8), `✅ Batch ${batch}: fixed ${data.fixed}, skipped ${data.skipped_already_perfect}`])
        if(data.done || data.processed===0){
          setLog(prev=>[...prev, `🎉 DONE - ${totalFixed} fixed like example app!`])
          break
        }
        batch++
        await new Promise(r=>setTimeout(r, 800)) // avoid rate limit
        if(batch>100) break
      }catch(e:any){
        setLog(prev=>[...prev, `❌ Batch ${batch} error: ${e.message}, retrying...`])
        await new Promise(r=>setTimeout(r, 2000))
      }
    }
    setRunning(false)
  }

  return (
    <div style={{padding:20, fontFamily:'monospace', background:'#000', color:'#0f0', minHeight:'100vh'}}>
      <h1>Fix 1000 Questions - Logs/Bases/Powers + R Rand</h1>
      <p>Processed: {done} | Fixed: {fixed}</p>
      <button onClick={start} disabled={running} style={{padding:'12px 20px', background: running?'#555':'#0f0', color:'#000', fontWeight:'bold', borderRadius:8}}>
        {running? 'Running...' : 'START FIX ALL (phone-friendly)'}
      </button>
      <div style={{marginTop:20, whiteSpace:'pre-wrap'}}>
        {log.map((l,i)=><div key={i}>{l}</div>)}
      </div>
      <p style={{marginTop:20, color:'#888'}}>This uses your working /api/admin/fix-latex?batch=X that you already proved works (batch 0 fixed 12). It auto-clicks next batch every 0.8s — no 504.</p>
    </div>
  )
}
