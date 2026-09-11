'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Factory() {
  const [pdfs, setPdfs] = useState<any[]>([])
  const [topics, setTopics] = useState<any[]>([])
  const [selPdfs, setSelPdfs] = useState<string[]>([])
  const [selTopics, setSelTopics] = useState<string[]>([])
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    (async()=>{
      const { data: pdfList } = await supabase.storage.from('source-pdfs').list()
      setPdfs(pdfList||[])
      
      // NO filter - show ALL topics so you see them again
      const { data: topicList, error } = await supabase.from('topic_knowledge').select('id, caps_code, topic_name, grade, subject').limit(100)
      console.log('topics:', topicList, error)
      setTopics(topicList||[])
    })()
  },[])

  const toggle = (arr:any, setArr:any, val:string) => {
    setArr(arr.includes(val) ? arr.filter((x:string)=>x!==val) : [...arr, val])
  }

  const queue = async () => {
    setMsg('Queuing...')
    const res = await fetch('/api/factory/batch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ topic_ids: selTopics, pdf_files: selPdfs })
    })
    const j = await res.json()
    setMsg(JSON.stringify(j, null, 2))
  }

  return (
    <div style={{padding:20, background:'#111', color:'#fff', minHeight:'100vh'}}>
      <h1>Math Batch - Flat + Bulk PDFs</h1>
      
      <h3>Step 1: Bulk Source PDFs ({pdfs.length} found)</h3>
      <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
      {pdfs.map(p=>(
        <label key={p.name} style={{background:'#222', padding:'6px 10px', borderRadius:8}}>
          <input type="checkbox" checked={selPdfs.includes(p.name)} onChange={()=>toggle(selPdfs,setSelPdfs,p.name)} /> {p.name}
        </label>
      ))}
      </div>

      <h3 style={{marginTop:20}}>Step 2: Maths Topics Only ({topics.length} found)</h3>
      <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
      {topics.map((t:any)=>(
        <label key={t.id} style={{background:'#222', padding:'6px 10px', borderRadius:8}}>
          <input type="checkbox" checked={selTopics.includes(t.id)} onChange={()=>toggle(selTopics,setSelTopics,t.id)} /> {t.topic_name} - G{t.grade} | {t.caps_code} | {t.id.slice(0,8)}
        </label>
      ))}
      </div>

      <div style={{marginTop:24, padding:12, background:'#333', borderRadius:10}}>
        TOPICS {selTopics.length} | PDFs {selPdfs.length} | EST ${(selTopics.length*0.04).toFixed(4)} 
        <button onClick={queue} style={{marginLeft:12, padding:'8px 16px', borderRadius:20, background:'#fff', color:'#000', fontWeight:'bold'}}>Generate Nodes A-E</button>
      </div>
      
      <pre style={{marginTop:20, background:'#000', padding:12, borderRadius:8, whiteSpace:'pre-wrap'}}>{msg}</pre>
    </div>
  )
}
