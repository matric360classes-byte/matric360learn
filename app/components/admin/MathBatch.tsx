'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://civwluydzbwqlnipmcll.supabase.co",
  "sb_publishable_9oINVwf0HWzC80NsBBP-WA_D5IyEng_"
)

export default function MathBatch() {
  const [topics, setTopics] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [pdfs, setPdfs] = useState<any[]>([])
  const [selectedPdfs, setSelectedPdfs] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    (async()=>{
      const { data } = await supabase.from('topic_knowledge').select('*')
      if(data) setTopics(data)
      const { data: files } = await supabase.storage.from('source-pdfs').list('', {limit:100})
      if(files) setPdfs(files)
    })()
  }, [])

  const handleBulkUpload = async (e:any) => {
    const files = e.target.files
    if(!files?.length) return
    setUploading(true)
    for (const file of files) {
      await supabase.storage.from('source-pdfs').upload(file.name, file, { upsert: true })
    }
    setUploading(false)
    const { data } = await supabase.storage.from('source-pdfs').list('', {limit:100})
    if(data) setPdfs(data)
    alert(`Uploaded ${files.length} PDFs`)
  }

  const filtered = topics.filter(t=> !filter || t.topic_name?.toLowerCase().includes(filter.toLowerCase()) || t.strand?.toLowerCase().includes(filter.toLowerCase()))
  const byStrand = filtered.reduce((acc:any,t)=>{
    const key = t.strand || 'Other'
    if(!acc[key]) acc[key]=[]
    acc[key].push(t)
    return acc
  },{})

  const handleGenerate = async () => {
    if(!selected.length) return alert('Select topics')
    if(!selectedPdfs.length) return alert('Select at least 1 PDF')
    const res = await fetch('/api/factory/batch', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ topic_ids: selected, pdf_files: selectedPdfs })
    })
    const json = await res.json()
    if(!res.ok) return alert(json.error)
    alert(`Queued ${json.queued} topics with ${selectedPdfs.length} PDFs → lesson_previews`)
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Math Batch - Flat (No Terms) + Bulk PDFs</h2>

      <div className="border-2 border-dashed p-3 rounded bg-gray-50">
        <div className="font-bold text-sm">Step 1: Bulk Source PDFs (Upload once, reuse)</div>
        <input type="file" multiple accept=".pdf" onChange={handleBulkUpload} className="mt-2" />
        {uploading && <div className="text-xs text-blue-600 mt-1">Uploading...</div>}
        <div className="mt-2 max-h-32 overflow-auto bg-white border p-2">
          {pdfs.map((f:any)=>(
            <label key={f.name} className="flex gap-2 text-xs py-1">
              <input type="checkbox" checked={selectedPdfs.includes(f.name)} onChange={()=>setSelectedPdfs(p=>p.includes(f.name)?p.filter(x=>x!==f.name):[...p,f.name])} />
              {f.name}
            </label>
          ))}
          {pdfs.length===0 && <div className="text-xs text-gray-400">No PDFs yet - upload textbooks + DBE papers + memos</div>}
        </div>
        <div className="text-xs">Selected PDFs: {selectedPdfs.length}</div>
      </div>

      <div className="border p-3 rounded">
        <div className="font-bold text-sm">Step 2: Select YOUR Approved Topics</div>
        <input placeholder="Filter by strand or topic" value={filter} onChange={e=>setFilter(e.target.value)} className="mt-2 w-full border p-2 rounded text-sm" />
        <div className="mt-3 space-y-3 max-h-96 overflow-auto">
          {Object.entries(byStrand).map(([strand, list]:any)=>(
            <div key={strand}>
              <div className="bg-gray-100 p-1 font-bold text-sm">{strand} ({list.length})</div>
              {list.map((t:any)=>(
                <label key={t.id} className="flex gap-2 text-xs p-1 hover:bg-gray-50">
                  <input type="checkbox" checked={selected.includes(t.id)} onChange={()=>setSelected(p=>p.includes(t.id)?p.filter(x=>x!==t.id):[...p,t.id])} />
                  {t.topic_name} <span className="text-[10px] text-gray-400 ml-auto">{t.grade} | {t.id.slice(0,8)}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <div className="bg-black text-white px-3 py-2 rounded text-xs">TOPICS {selected.length} | PDFs {selectedPdfs.length} | EST ${(selected.length*0.0475).toFixed(4)}</div>
        <button onClick={handleGenerate} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">Generate Nodes A-E → staging</button>
      </div>
    </div>
  )
}
