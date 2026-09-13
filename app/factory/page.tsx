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

  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const loadPdfs = async () => {
    const { data } = await supa.from('source_pdfs').select('*').order('created_at', { ascending: false })
    if (data) setPdfs(data)
  }
  useEffect(() => { loadPdfs() }, [])

  // --- STEP 1: BULK UPLOAD (your working code) ---
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setLogs([])
    const fileList = Array.from(files)
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      setProgress(`[${i+1}/${fileList.length}] ${file.name}`)
      try {
        const r1 = await fetch('/api/factory/signed-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: file.name })
        })
        const text = await r1.text()
        let data: any
        try { data = JSON.parse(text) } catch { throw new Error(text.slice(0,300)) }
        if (!r1.ok) throw new Error(data.error || text.slice(0,300))
        const { error: upErr } = await supa.storage.from('source-pdfs').uploadToSignedUrl(data.path, data.token, file)
        if (upErr) throw new Error(upErr.message)
        const r2 = await fetch('/api/factory/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: data.path, fileName: file.name, fileSize: file.size })
        })
        if (!r2.ok) throw new Error(await r2.text())
        setLogs(prev => [...prev, `✅ ${file.name}`])
      } catch (err:any) {
        setLogs(prev => [...prev, `❌ ${file.name}: ${err.message}`])
      }
    }
    setUploading(false)
    setProgress('Done')
    loadPdfs()
  }

  // --- STEP 2: PROCESS TO LESSONS ---
  const processPdf = async (pdf: SourcePDF) => {
    setProcessing(true)
    setProgress(`Processing ${pdf.file_name}...`)
    try {
      const r = await fetch('/api/factory/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pdf.id })
      })
      const t = await r.text()
      if (!r.ok) throw new Error(t.slice(0,500))
      setLogs(prev => [...prev, `📚 ${pdf.file_name}: ${t}`])
      loadPdfs()
    } catch (e:any) {
      setLogs(prev => [...prev, `❌ Process ${pdf.file_name}: ${e.message}`])
    }
    setProcessing(false)
    setProgress('Done')
  }

  const processAll = async () => {
    for (const pdf of pdfs.filter(p=>p.status==='uploaded')) {
      await processPdf(pdf)
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', maxWidth: 800 }}>
      <h1>Batch - All Subjects + Bulk PDFs</h1>
      <p>Supports lots of big PDFs at same time (direct to Supabase)</p>

      <div style={{ background: '#111', padding: 15, borderRadius: 8, marginBottom: 20 }}>
        <h3>Step 1: Bulk Source PDFs ({pdfs.length} found)</h3>
        <input type="file" multiple accept=".pdf" onChange={handleBulkUpload} disabled={uploading} />
        <p>{progress}</p>
        <div style={{ background: '#000', color: '#0f0', padding: 10, minHeight: 100, whiteSpace: 'pre-wrap' }}>
          {logs.map((l,i)=><div key={i}>{l}</div>)}
        </div>
        <div style={{ marginTop: 10 }}>
          {pdfs.map(p=>(
            <div key={p.id} style={{ borderBottom: '1px solid #333', padding: '6px 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>{p.file_name} - {p.status}</span>
              {p.status==='uploaded' && <button onClick={()=>processPdf(p)} disabled={processing} style={{ background: '#0a0', color: '#fff', border: 0, padding: '4px 8px' }}>Process to Lessons</button>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#111', padding: 15, borderRadius: 8 }}>
        <h3>Step 2: Generate Lessons from PDFs</h3>
        <p>This will create real lessons with content (not empty) for Nodes page.</p>
        <button onClick={processAll} disabled={processing || pdfs.length===0} style={{ background: 'blue', color: 'white', padding: '10px 20px', border: 0, borderRadius: 6 }}>
          {processing? 'Processing...' : `Process All ${pdfs.filter(p=>p.status==='uploaded').length} PDFs to Lessons`}
        </button>
      </div>
    </div>
  )
}
