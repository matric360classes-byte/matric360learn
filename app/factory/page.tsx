const [uploading, setUploading] = useState(false)
const [progress, setProgress] = useState<string>('')

const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files
  if (!files) return
  setUploading(true)

  const fileList = Array.from(files)
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    setProgress(`Uploading ${i+1}/${fileList.length}: ${file.name}`)

    // 1. get signed url
    const r1 = await fetch('/api/factory/signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName: file.name })
    })
    const { path, token } = await r1.json()

    // 2. upload DIRECT to Supabase (not through Vercel)
    const { createClient } = await import('@supabase/supabase-js')
    const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { error: upErr } = await supa.storage.from('source-pdfs').uploadToSignedUrl(path, token, file)
    if (upErr) { console.error(upErr); continue }

    // 3. confirm in DB
    await fetch('/api/factory/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, fileName: file.name, fileSize: file.size })
    })
  }
  setUploading(false)
  setProgress('Done!')
  window.location.reload()
}
