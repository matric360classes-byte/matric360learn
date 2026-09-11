import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { topic_ids, pdf_files } = await req.json()
    
    if(!topic_ids?.length) return NextResponse.json({error:'No topics selected - tick a checkbox in Step 2', queued:0}, {status:400})
    if(!pdf_files?.length) return NextResponse.json({error:'No PDFs selected - tick 2 PDFs in Step 1', queued:0}, {status:400})

    // DEBUG: get topics
    const { data: topics, error: topicErr } = await supabase.from('topic_knowledge').select('*').in('id', topic_ids)
    
    if(topicErr) return NextResponse.json({error:`Topic lookup failed: ${topicErr.message}`, queued:0, topic_ids}, {status:500})
    if(!topics?.length) return NextResponse.json({error:`No topics found for IDs ${JSON.stringify(topic_ids)} - IDs truncated?`, queued:0}, {status:400})

    let queued = 0
    let lastError = null
    for(const topic of topics){
      const { error } = await supabase.from('lesson_previews').insert({
        topic_id: topic.id,
        topic_name: topic.topic_name,
        grade: (topic.grade || topic.grade_level || '10').toString(),
        subject: topic.subject || 'Mathematics',
        source_pdfs: pdf_files,
        status: 'queued',
        quality_score: 0,
        created_at: new Date().toISOString()
      })
      if(error) lastError = error.message
      else queued++
    }

    return NextResponse.json({ queued, pdf_files_used: pdf_files, topics_found: topics.length, lastError, message: `Queued ${queued} topics` })
  } catch(e:any){
    return NextResponse.json({error: e.message, queued:0}, {status:500})
  }
}
