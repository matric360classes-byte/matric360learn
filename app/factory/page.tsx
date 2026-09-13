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
      // 1. get signed url
      const r1 = await fetch('/api/factory/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name })
      })

      const text = await r1.text() // get raw response first
      let data
      try { data = JSON.parse(text) }
      catch { throw new Error(`Server returned: ${text.slice(0,200)}`) }

      if (!r1.ok) throw new Error(data.error || `HTTP ${r1.status}: ${text.slice(0,200)}`)
      if (!data.token ||!data.path) throw new Error(`Missing token/path: ${JSON.stringify(data)}`)

      // 2. upload
      const { error: upErr } = await supa.storage
       .from('source-pdfs')
       .uploadToSignedUrl(data.path, data.token, file)

      if (upErr) throw new Error(`Storage error: ${upErr.message}`)

      // 3. confirm
      const r2 = await fetch('/api/factory/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: data.path, fileName: file.name, fileSize: file.size })
      })
      const r2t = await r2.text()
      if (!r2.ok) throw new Error(`Batch save failed: ${r2t.slice(0,200)}`)

      setLogs(prev => [...prev, `✅ ${file.name}`])

    } catch (err:any) {
      setLogs(prev => [...prev, `❌ ${file.name}: ${err.message}`])
    }
  }
  setUploading(false)
  setProgress('Done - check logs below')
}
