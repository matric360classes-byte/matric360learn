import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { topic_ids, pdf_files } = await req.json()
    
    if (!topic_ids || topic_ids.length === 0) {
      return NextResponse.json({ queued: 0, error: 'No topics selected' })
    }

    // Get topic details from topic_knowledge
    const { data: topics, error: topicErr } = await supabase
      .from('topic_knowledge')
      .select('id, caps_code, topic_name, subject, grade')
      .in('id', topic_ids)

    if (topicErr) return NextResponse.json({ queued: 0, error: topicErr.message })
    if (!topics || topics.length === 0) return NextResponse.json({ queued: 0, error: 'No topics found for those IDs' })

    // Insert into lesson_previews using REAL columns
    const rows = topics.map((t: any) => ({
      caps_code: t.caps_code,
      subject: t.subject || 'Mathematics',
      topic_name: t.topic_name,
      grade: String(t.grade),
      source_pdfs: pdf_files, // jsonb
      status: 'queued',
      content: {},
      cost_usd: 0
    }))

    const { data, error } = await supabase
      .from('lesson_previews')
      .insert(rows)
      .select()

    if (error) return NextResponse.json({ queued: 0, error: error.message, details: error })

    return NextResponse.json({ queued: data.length, data })
  } catch (e: any) {
    return NextResponse.json({ queued: 0, error: e.message })
  }
}
