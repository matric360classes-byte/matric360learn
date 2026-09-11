'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function MathBatch() {
  const [topics, setTopics] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [pdfs, setPdfs] = useState<any[]>([])
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    supabase.from('topic_knowledge').select('*').eq('subject','Mathematics').then(({data})=>data&&setTopics(data))
    loadPdfs()
  }, [])

  const loadPdfs = async () => {
    const { data } = await supabase.storage.from('source-pdfs').list('', {limit:100})
    if(data) setPdfs(data)
  }

  const handleBulkUpload = async (e:any) => {
    const files = e.target.files
    if(!files.length) return
    setUploading(true)
    for (const file of files) {
      await supabase.storage.from('source-pdfs').upload(file.name, file, { upsert: true })
    }
    setUploading(false)
    loadPdfs()
    alert(`Uploaded ${files.length} PDFs to source-pdfs`)
  }

  const byStrand = topics.reduce((acc:any,t)=>{
    if(!acc[t.strand]) acc[t.strand]=[]
    acc[t.strand].push(t)
    return acc
  },{})

  const handleGenerate = async () => {
    if(!selected.length) return alert('Select topics')
    if(!selectedPdfs.length) return alert('Select at least 1 PDF as source')
    
    const res = await fetch('/api/factory/batch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        topic_ids: selected,
        pdf_files: selectedPdfs,
        provider: 'google/gemini-2.5-pro'
      })
    })
    const json = await res.json()
    if(!res.ok) return alert(json.error)
    alert(`Queued ${json.queued} topics using ${selectedPdfs.length} PDFs`)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Math Batch - Nodes A-E Factory (Flat, Bulk PDFs)</h1>

      {/* BULK PDF SECTION - THIS IS NEW */}
      <div className="border-2 border-dashed p-4 rounded bg-gray-50">
        <h2 className="font-bold">Step 1: Bulk Source PDFs (Textbooks + DBE Papers + Memos)</h2>
        <p className="text-xs text-gray-500">Upload 20-50 PDFs once. They will be reused for all topics. No need to upload one by one.</p>
        
        <input type="file" multiple accept=".pdf" onChange={handleBulkUpload} className="mt-3" />
        {uploading && <div className="text-sm text-blue-600">Uploading bulk PDFs...</div>}
        
        <div className="mt-3 max-h-40 overflow-y-auto border bg-white p-2">
          {pdfs.map(f=>(
            <label key={f.name} className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={selectedPdfs.includes(f.name)} onChange={()=>setSelectedPdfs(p=>p.includes(f.name)?p.filter(x=>x!==f.name):[...p,f.name])} />
              {f.name} <span className="text-xs text-gray-400">({(f.metadata?.size/1024/1024).toFixed(2)} MB)</span>
            </label>
          ))}
          {pdfs.length===0 && <div className="text-xs text-gray-400">No PDFs yet. Upload above.</div>}
        </div>
        <div className="text-xs mt-1">Selected PDFs: {selectedPdfs.length} → These will be context for Nodes A-E generation</div>
      </div>

      {/* TOPICS SECTION - YOUR 9 TOPICS */}
      <div className="border p-4 rounded">
        <h2 className="font-bold">Step 2: Select Approved Topics (YOUR new app topics)</h2>
        <div className="mt-3 space-y-4">
          {Object.entries(byStrand).map(([strand, list]:any)=>(
            <div key={strand}>
              <div className="font-bold bg-gray-100 p-1">{strand} ({list.length})</div>
              {list.map((t:any)=>(
                <label key={t.id} className="flex gap-2 text-sm p-1 hover:bg-gray-50">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={()=>setSelected(p=>p.includes(t.id)?p.filter(x=>x!==t.id):[...p,t.id])} />
                  {t.topic_name} <span className="text-xs text-gray-400 ml-auto">{t.grade} | {t.id.slice(0,8)}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="bg-black text-white p-2 rounded text-sm">TOPICS {selected.length} | PDFs {selectedPdfs.length} | EST ${(selected.length*0.0475).toFixed(4)}</div>
        <button onClick={handleGenerate} className="ml-auto bg-blue-600 text-white px-6 py-2 rounded font-bold">Generate Nodes A-E → lesson_previews</button>
      </div>

      <div className="text-xs text-gray-500">
        Flow: source-pdfs (bulk) + YOUR topic_id → Gemini → lesson_previews (staging, quality 0-100) → Publish Queue → YOUR Nodes table (no pop-up). Practice Exams factory is separate.
      </div>
    </div>
  )
}
