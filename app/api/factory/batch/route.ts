import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if(!url ||!key) return NextResponse.json({error:`Env missing: URL=${!!url} KEY=${!!key} - Go to Vercel Settings`, queued:0}, {status:500})

    const supabase = createClient(url, key)
    const { topic_ids, pdf_files, topics_meta } = await req.json()

    if(!topic_ids?.length) return NextResponse.json({error:'Tick at least 1 topic in Step 2', queued:0}, {status:400})
    if(!pdf_files?.length) return NextResponse.json({error:'Tick 2 PDFs in Step 1', queued:0}, {status:400})

    let queued = 0
    let lastError = null
    for(let i=0; i<topic_ids.length; i++){
      const id = topic_ids[i]
      const meta = topics_meta?.find((t:any)=>t.id===id) || {}
      const { error } = await supabase.from('lesson_previews').insert({
        topic_id: id,
        topic_name: meta.name || meta.topic_name || id,
        grade: (meta.grade || '12').toString(),
        subject: 'Mathematics',
        source_pdfs: pdf_files, // ONLY checked PDFs
        status: 'queued',
        quality_score: 0
      })
      if(error) lastError = error.message
      else queued++
    }

    return NextResponse.json({ queued, pdf_files_used: pdf_files, message: `Queued ${queued} topics with ${pdf_files.length} PDFs only`, lastError })
  } catch(e:any){
    return NextResponse.json({error:e.message, queued:0}, {status:500})
  }
}
