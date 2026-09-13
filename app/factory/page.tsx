'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function FactoryPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    setLogs([])

    const fileList = Array.from(files)
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

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
        try { data = JSON.parse(text) }
        catch { throw new Error(`Server returned: ${text.slice(0,300)}`) }

        if (!r1.ok) throw new Error(data.error || `HTTP ${r1.status}: ${text.slice(0,300)}`)
        if (!data.token ||!data.path) throw new Error(`No token/path: ${JSON.stringify(data)}`)

        const { error: upErr } = await supa.storage
         .from('source-pdfs')
         .uploadToSignedUrl(data.path, data.token, file)

        if (upErr) throw new Error(`Storage: ${upErr.message}`)

        const r2 = await fetch('/api/factory/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: data.path, fileName: file.name, fileSize: file.size })
        })
        const r2t = await r2.text()
        if (!r2.ok) throw new Error(`Batch save: ${r2t.slice(0,300)}`)

        setLogs(prev => [...prev, `✅ ${file.name} uploaded`])
      } catch (err:any) {
        setLogs(prev => [...prev, `❌ ${file.name}: ${err.message}`])
      }
    }
    setUploading(false)
    setProgress('Done - check logs')
  }

  return (
    <div style={{ padding: 20, fontFamily: 'monospace' }}>
      <h1>Factory - Bulk Upload</h1>
      <input type="file" multiple accept=".pdf" onChange={handleBulkUpload} disabled={uploading} />
      <p>{progress}</p>
      <div style={{ background: '#000', color: '#0f0', padding: 10, minHeight: 200, whiteSpace: 'pre-wrap' }}>
        {logs.map((l,i) => <div key={i}>{l}</div>)}
        {logs.length === 0 && 'Logs will appear here...'}
      </div>
    </div>
  )
}
