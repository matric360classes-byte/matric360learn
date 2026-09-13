import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  
  // Get all uploaded PDFs (handles 400+ at once)
  const { data: pdfs, error } = await supabase.from('source_pdfs').select('*').eq('status','uploaded').limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!pdfs || pdfs.length===0) return NextResponse.json({ message: 'No uploaded PDFs found. All already processed.' })

  let created = 0
  for (const pdf of pdfs) {
    const name = pdf.file_name.toLowerCase()
    let subject = 'General'
    if (name.includes('math')) subject = 'Mathematics'
    else if (name.includes('phys')) subject = 'Physical Sciences'
    else if (name.includes('chem') || name.includes('chemistry')) subject = 'Physical Sciences'
    else if (name.includes('life')) subject = 'Life Sciences'
    else if (name.includes('geog')) subject = 'Geography'
    else if (name.includes('history')) subject = 'History'

    let grade = 12
    if (name.includes('gr11') || name.includes('grade 11') || name.includes('gr 11') || name.includes('_11_')) grade = 11
    if (name.includes('gr10') || name.includes('grade 10')) grade = 10

    const lesson = {
      title: pdf.file_name.replace('.pdf','').replace(/_/g,' ').replace(/-/g,' ').slice(0,120),
      subject,
      grade,
      source_pdf_id: pdf.id,
      content: {
        summary: `Complete guide from ${pdf.file_name}`,
        source_path: pdf.storage_path,
        file_name: pdf.file_name,
        has_pdf: true
      },
      status: 'published'
    }

    const { error: insErr } = await supabase.from('lessons').insert(lesson)
    if (!insErr) {
      await supabase.from('source_pdfs').update({ status: 'processed' }).eq('id', pdf.id)
      created++
    }
  }

  return NextResponse.json({ ok: true, processed: created, total: pdfs.length, message: `Created ${created} lessons from ${pdfs.length} PDFs` })
}
