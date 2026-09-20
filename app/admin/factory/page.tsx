"use client"
import { useState } from "react"

export default function Admin(){
  const [log,setLog]=useState<string[]>([])
  const [batch,setBatch]=useState(0)
  
  async function runAll(){
    for(let b=0; b<45; b++){
      setBatch(b)
      setLog(l=>[...l, `Starting batch ${b}...`])
      try{
        const r=await fetch(`/api/generate-all?batch=${b}`)
        const j=await r.json()
        setLog(l=>[...l, `✅ Batch ${b}: ${j.nodes_created} nodes - ${j.topics_processed?.join(',')}`])
      }catch(e:any){
        setLog(l=>[...l, `❌ Batch ${b} failed: ${e.message}`])
      }
      await new Promise(res=>setTimeout(res,2000))
    }
    setLog(l=>[...l, `🎉 DONE! All 675 nodes generated!`])
  }

  return(
    <div style={{background:'black',color:'white',minHeight:'100vh',padding:20}}>
      <h1>Matric360 - Generate 675 Lessons from PDFs via OpenAI</h1>
      <button onClick={runAll} style={{background:'white',color:'black',padding:'12px 20px',borderRadius:8,margin:'20px 0'}}>START - Generate All 675 Nodes</button>
      <p>Current batch: {batch} / 45</p>
      <div style={{whiteSpace:'pre-wrap',background:'#111',padding:10,borderRadius:8}}>
        {log.join('\n')}
      </div>
    </div>
  )
}
