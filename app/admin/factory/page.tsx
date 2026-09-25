"use client"
import { useState } from "react"

export default function Admin(){
  const [log,setLog]=useState<string[]>([])
  const [batch,setBatch]=useState(0)
  const [mode, setMode] = useState<"lessons"|"questions">("lessons")

  // EXISTING: Generate 675 Lessons (your current code)
  async function runAll(){
    setMode("lessons")
    for(let b=0; b<45; b++){
      setBatch(b)
      setLog(l=>[...l, `Starting batch ${b}...`])
      try{
        const r=await fetch(`/api/generate-all?batch=${b}`)
        const j=await r.json()
        setLog(l=>[...l, `✅ Batch ${b}: ${j.nodes_created} nodes - ${j.topics_processed} topics`])
      }catch(e:any){
        setLog(l=>[...l, `❌ Batch ${b} failed: ${e.message}`])
      }
      await new Promise(res=>setTimeout(res,2000))
    }
    setLog(l=>[...l, `🎉 DONE! All 675 nodes generated!`])
  }

  // NEW: Generate 3000+ Questions from SAME 103 PDFs - NO TERM
  async function runQuestions(){
    setMode("questions")
    setLog([])
    for(let b=0; b<45; b++){
      setBatch(b)
      setLog(l=>[...l, `Starting questions batch ${b}...`])
      try{
        const r=await fetch(`/api/generate-questions?batch=${b}`)
        const j=await r.json()
        setLog(l=>[...l, `✅ Batch ${b}: ${j.questions_created} questions - ${j.source_pdfs} PDFs`])
      }catch(e:any){
        setLog(l=>[...l, `❌ Batch ${b} failed: ${e.message}`])
      }
      await new Promise(res=>setTimeout(res,2000))
    }
    setLog(l=>[...l, `🎉 DONE! Question Bank ready - Check Exam Hub > Questions`])
  }

  return(
    <div style={{background:'black',color:'white',minHeight:'100vh',padding:20}}>
      <h1>Matric360 - Generate 675 Lessons from PDFs via OpenAI</h1>

      <div style={{display:'flex',gap:12,marginTop:16}}>
        <button onClick={runAll} style={{background:'white',color:'black',padding:'12px 20px',borderRadius:8,fontWeight:'bold'}}>
          Generate 675 Lessons
        </button>
        <button onClick={runQuestions} style={{background:'#7c7cff',color:'white',padding:'12px 20px',borderRadius:8,fontWeight:'bold'}}>
          Generate Questions Bank (No Term)
        </button>
      </div>

      <p style={{marginTop:16}}>Current batch: {batch} / 45 - Mode: {mode}</p>

      <div style={{whiteSpace:'pre-wrap',background:'#111',padding:10,borderRadius:8,marginTop:12,height:'60vh',overflow:'auto'}}>
        {log.map((l,i)=><div key={i}>{l}</div>)}
      </div>
    </div>
  )
}
