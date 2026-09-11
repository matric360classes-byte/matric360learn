import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { topic_ids, pdf_files } = await req.json()
    
    if(!topic_ids?.length) return NextResponse.json({error:'No topics selected'}, {status:400})
    if(!pdf_files?.length) return NextResponse.json({error:'No PDFs selected - tick at least 1 PDF in Step 1'}, {status:400})

    // Get topics details
    const { data: topics } = await supabase.from('topic_knowledge').select('*').in('id', topic_ids)
    
    let queued = 0
    for(const topic of topics || []) {
      // Create job in lesson_previews with ONLY selected PDFs
      const { error } = await supabase.from('lesson_previews').insert({
        topic_id: topic.id,
        topic_name: topic.topic_name,
        grade: topic.grade || topic.grade_level,
        subject: topic.subject,
        source_pdfs: pdf_files, // ONLY the checked ones, not all in bucket
        status: 'queued',
        quality_score: 0,
        created_at: new Date().toISOString()
      })
      if(!error) queued++
    }

    return NextResponse.json({ queued, pdf_files_used: pdf_files, message: `Queued ${queued} topics with ${pdf_files.length} PDFs only` })
  } catch(e:any) {
    return NextResponse.json({error: e.message}, {status:500})
  }
}
