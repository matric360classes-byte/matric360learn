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

  useEffect(() => {
    (async()=>{
      // FIX 1: Filter ONLY Maths from topic_knowledge
      const { data } = await supabase.from('topic_knowledge').select('*').ilike('subject','%math%')
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

  // FIX 2: Group by strand, if strand empty → group by grade → if still empty → Other
  const byGroup = topics.reduce((acc:any,t)=>{
    let key = t.strand
    if(!key || key.trim()==='') key = `Grade ${t.grade || t.grade_level || 'Other'}`
    if(!key) key = 'Other'
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
    alert(`Queued ${json.queued} topics`)
  }

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4 bg-white text-black rounded">
      <h1 className="text-xl font-bold">Math Batch - Flat + Bulk PDFs</h1>

      <div className="border-2 border-dashed p-4 rounded">
        <div className="font-bold">Step 1: Bulk Source PDFs</div>
        <p className="text-xs text-gray-500">Create bucket <b>source-pdfs</b> in Supabase Storage first, then upload textbooks + DBE papers + memos (20-50 at once)</p>
        <input type="file" multiple accept=".pdf" onChange={handleBulkUpload} className="mt-2 block" />
        {uploading && <div className="text-sm text-blue-600">Uploading...</div>}
        <div className="mt-2 border max-h-32 overflow-auto p-2">
          {pdfs.map((f:any)=>(
            <label key={f.name} className="flex items-center gap-2 text-sm py-1">
              <input type="checkbox" checked={selectedPdfs.includes(f.name)} onChange={()=>setSelectedPdfs(p=>p.includes(f.name)?p.filter(x=>x!==f.name):[...p,f.name])} />
              {f.name}
            </label>
          ))}
          {pdfs.length===0 && <div className="text-xs text-gray-400">Bucket empty or bucket not created yet. Go to Supabase → Storage → New bucket → name: source-pdfs</div>}
        </div>
      </div>

      <div className="border p-4 rounded">
        <div className="font-bold">Step 2: Maths Topics Only ({topics.length} found)</div>
        <div className="mt-3 space-y-4">
          {Object.entries(byGroup).map(([group, list]:any)=>(
            <div key={group} className="border-b pb-2">
              <div className="font-bold bg-gray-100 p-2 rounded">{group} ({list.length})</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-2">
                {list.map((t:any)=>(
                  <label key={t.id} className="flex items-start gap-2 text-sm p-2 border rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={selected.includes(t.id)} onChange={()=>setSelected(p=>p.includes(t.id)?p.filter(x=>x!==t.id):[...p,t.id])} />
                    <span>{t.topic_name} <span className="text-[10px] text-gray-400">| {t.id.slice(0,8)}</span></span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center bg-black text-white p-3 rounded">
        <span className="text-sm">TOPICS {selected.length} | PDFs {selectedPdfs.length} | EST ${(selected.length*0.0475).toFixed(4)}</span>
        <button onClick={handleGenerate} className="ml-auto bg-blue-600 px-4 py-2 rounded font-bold">Generate Nodes A-E</button>
      </div>
    </div>
  )
}
