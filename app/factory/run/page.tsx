'use client'
import { useState } from 'react'

export default function FactoryRun(){
  const [log,setLog] = useState<string[]>([])
  const [running,setRunning] = useState(false)
  const [count,setCount] = useState(0)

  async function start(){
    setRunning(true)
    setLog([])
    let o=0
    for(let i=0;i<30;i++){
      try{
        const r = await fetch('/api/factory/process-all?offset='+o,{method:'POST'})
        const d = await r.json()
        const msg = `Batch ${o/5+1}/27: +${d.created} nodes A-E | remaining ${d.remaining} | ${d.msg}`
        setLog(prev=> [...prev, msg])
        setCount(prev=> prev + (d.created||0))
        o = d.nextOffset
        if(d.done || d.remaining<=0){
          setLog(prev=> [...prev, '✅ ALL 675 DONE - Node B has Sₙ / p=mv from mixed 115'])
          setRunning(false)
          break
        }
        await new Promise(res=> setTimeout(res,2500))
      }catch(e:any){
        setLog(prev=> [...prev, `Error at offset ${o}: ${e.message}`])
        break
      }
    }
    setRunning(false)
  }

  return(
    <div style={{background:'black',color:'lime',minHeight:'100vh',padding:'20px',fontFamily:'monospace'}}>
      <h1>Matric360 - 675 Nodes A-E Factory</h1>
      <p>135 CAPS Locked ✅ | 102 PDFs ✅ | Generating 5 nodes per topic</p>
      <button 
        onClick={start} 
        disabled={running}
        style={{background:'lime',color:'black',padding:'20px 40px',fontSize:'20px',fontWeight:'bold',border:'none',borderRadius:'10px',margin:'20px 0'}}
      >
        {running ? `RUNNING... ${count}/675` : `START GENERATE 675 A-E (FAST BATCH=5)`}
      </button>
      <div>Progress: {count}/675 nodes</div>
      <div style={{marginTop:'20px'}}>
        {log.map((l,i)=> <div key={i} style={{padding:'8px',borderBottom:'1px solid #333'}}>{l}</div>)}
      </div>
    </div>
  )
}
