'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

type PdfFile = { file_name: string; file_path?: string }

export default function FactoryPage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [pdfs, setPdfs] = useState<PdfFile[]>([])
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    fetchPdfs()
  }, [])

  const fetchPdfs = async () => {
    const res = await fetch('/api/factory/batch')
    const data = await res.json()
    setPdfs(data.files || [])
  }

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setLogs([])

    const fileList = Array.from(files)
    const supa = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Upload 5 in parallel for speed
    for (let i = 0; i < fileList.length; i += 5) {
      const chunk = fileList.slice(i, i + 5)
      await Promise.all(
        chunk.map(async (file, idx) => {
          const num = i + idx + 1
          try {
            setProgress(`[${num}/${fileList.length}] ${file.name} - getting URL...`)

            const r1 = await fetch('/api/factory/signed-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fileName: file.name }),
            })
            const { path, token, error } = await r1.json()
            if (error) throw new Error(error)

            setProgress(`[${num}/${fileList.length}] ${file.name} - uploading direct to storage...`)

            const { error: upErr } = await supa.storage
              .from('source-pdfs')
              .uploadToSignedUrl(path, token, file)

            if (upErr) throw upErr

            setProgress(`[${num}/${fileList.length}] ${file.name} - saving to DB...`)

            const r2 = await fetch('/api/factory/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ path, fileName: file.name, fileSize: file.size }),
            })
            const r2j = await r2.json()
            if (r2j.error) throw new Error(r2j.error)

            setLogs((prev) => [...prev, `✅ ${file.name} uploaded`])
          } catch (err: any) {
            setLogs((prev) => [...prev, `❌ ${file.name}: ${err.message}`])
          }
        })
      )
    }

    setUploading(false)
    setProgress(`Done! ${fileList.length} files processed`)
    fetchPdfs()
    // Don't reload, just refresh list
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Batch - All Subjects + Bulk PDFs</h1>
      <p className="text-sm text-gray-500 mb-6">Supports lots of big PDFs at same time (direct to Supabase)</p>

      <div className="border-2 border-dashed p-6 rounded-lg mb-6 bg-gray-50">
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleBulkUpload}
          disabled={uploading}
          className="w-full"
        />
        {uploading && <div className="text-sm mt-3 font-mono text-blue-600">{progress}</div>}
        {!uploading && progress && <div className="text-sm mt-3 font-mono text-green-600">{progress}</div>}
      </div>

      {logs.length > 0 && (
        <div className="bg-black text-white p-3 rounded text-xs font-mono mb-6 max-h-40 overflow-auto">
          {logs.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      )}

      <h2 className="font-bold mb-2">Step 1: Bulk Source PDFs ({pdfs.length} found)</h2>
      <div className="border rounded">
        {pdfs.map((pdf, i) => (
          <div key={i} className="p-2 border-b text-sm flex justify-between">
            <span>{pdf.file_name}</span>
            <span className="text-green-600">Uploaded</span>
          </div>
        ))}
        {pdfs.length === 0 && <div className="p-4 text-sm text-gray-400">No PDFs yet - upload above</div>}
      </div>
    </div>
  )
}
