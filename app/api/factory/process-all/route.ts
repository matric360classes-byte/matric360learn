import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  
  const { data: pdfs, error } = await supabase.from('source_pdfs').select('*').eq('status','uploaded').limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!pdfs || pdfs.length===0) return NextResponse.json({ message: 'No uploaded PDFs - maybe all processed. Check source_pdfs table.' })

  let created = 0
  for (const pdf of pdfs) {
    const name = pdf.file_name.toLowerCase()
    let subject = 'General'
    if (name.includes('math')) subject = 'Mathematics'
    else if (name.includes('phys') || name.includes('chem')) subject = 'Physical Sciences'
    else if (name.includes('life')) subject = 'Life Sciences'

    let grade = 12
    if (name.includes('gr11') || name.includes('11')) grade = 11
    if (name.includes('gr10') || name.includes('10')) grade = 10

    // Insert into lesson_nodes (your real table)
    const { error: insErr } = await supabase.from('lesson_nodes').insert({
      title: pdf.file_name.replace('.pdf','').slice(0,120),
      subject,
      grade,
      content: {
        summary: `Complete guide from ${pdf.file_name}`,
        source_path: pdf.storage_path,
        file_name: pdf.file_name,
        has_pdf: true
      },
      status: 'published'
    })

    if (!insErr) {
      await supabase.from('source_pdfs').update({ status: 'processed' }).eq('id', pdf.id)
      created++
    }
  }
  return NextResponse.json({ ok: true, created, total: pdfs.length })
}
