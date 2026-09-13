'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
type SourcePDF = { id: string, file_name: string, storage_path: string, status: string }
export default function FactoryPage() {
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [logs, setLogs] = useState<string[]>([])
  const [pdfs, setPdfs] = useState<SourcePDF[]>([])
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const loadPdfs = async () => {
    const { data } = await supa.from('source_pdfs').select('*').order('created_at', { ascending: false }).limit(500)
    if (data) setPdfs(data)
  }
  useEffect(() => { loadPdfs() }, [])
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return; setUploading(true); setLogs([])
    const fileList = Array.from(files)
    for (let i=0;i<fileList.length;i++) {
      const file=fileList[i]; setProgress(`[${i+1}/${fileList.length}] ${file.name}`)
      try {
        const r1=await fetch('/api/factory/signed-url',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fileName:file.name})})
        const t=await r1.text(); let d:any; try{d=JSON.parse(t)}catch{throw new Error(t.slice(0,200))}
        if(!r1.ok) throw new Error(d.error||t.slice(0,200))
        const {error:upErr}=await supa.storage.from('source-pdfs').uploadToSignedUrl(d.path,d.token,file)
        if(upErr) throw new Error(upErr.message)
        const r2=await fetch('/api/factory/batch',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:d.path,fileName:file.name,fileSize:file.size})})
        if(!r2.ok) throw new Error(await r2.text())
        setLogs(p=>[...p,`✅ ${file.name}`])
      } catch(err:any){ setLogs(p=>[...p,`❌ ${file.name}: ${err.message}`]) }
    }
    setUploading(false); setProgress('Done'); loadPdfs()
  }
  const processPdf = async (pdf: SourcePDF) => {
    setProcessing(true); setProgress(`Processing ${pdf.file_name}...`)
    try {
      const r=await fetch('/api/factory/process-all',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ids:[pdf.id]})})
      const t=await r.text(); if(!r.ok) throw new Error(t.slice(0,500))
      setLogs(p=>[...p,`✅ ${pdf.file_name}: ${t}`]); loadPdfs()
    } catch(e:any){ setLogs(p=>[...p,`❌ ${e.message}`]) }
    setProcessing(false)
  }
  const processAll = async () => {
    setProcessing(true); setProgress('Processing all...')
    try {
      const r=await fetch('/api/factory/process-all',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({})})
      const t=await r.text(); if(!r.ok) throw new Error(t.slice(0,800))
      setLogs(p=>[...p,`📚 ALL: ${t}`]); loadPdfs()
    } catch(e:any){ setLogs(p=>[...p,`❌ ${e.message}`]) }
    setProcessing(false)
  }
  return (
    <div style={{padding:20,fontFamily:'monospace',maxWidth:900}}>
      <h1>Batch - All Subjects + Bulk PDFs</h1>
      <div style={{background:'#111',padding:15,borderRadius:8,marginBottom:20}}>
        <h3>Step 1: Bulk Source PDFs ({pdfs.length} found)</h3>
        <input type="file" multiple accept=".pdf" onChange={handleBulkUpload} disabled={uploading}/>
        <p>{progress}</p>
        <div style={{background:'#000',color:'#0f0',padding:10,minHeight:80,whiteSpace:'pre-wrap',maxHeight:300,overflow:'auto'}}>{logs.map((l,i)=><div key={i}>{l}</div>)}</div>
        <div style={{marginTop:10}}>{pdfs.map(p=><div key={p.id} style={{borderBottom:'1px solid #333',padding:'6px 0',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:12}}>{p.file_name} - {p.status}</span><button onClick={()=>processPdf(p)} disabled={processing} style={{background:'#0a0',color:'#fff',border:0,padding:'4px 8px'}}>Process to Lessons</button></div>)}</div>
      </div>
      <div style={{background:'#111',padding:15,borderRadius:8}}>
        <h3>Step 2: Generate Lessons from PDFs</h3>
        <button onClick={processAll} disabled={processing} style={{background:'blue',color:'white',padding:'12px 20px',border:0,borderRadius:6}}>{processing?'Processing...':`Process All ${pdfs.filter(p=>p.status==='uploaded').length} PDFs to Lessons`}</button>
      </div>
    </div>
  )
}
