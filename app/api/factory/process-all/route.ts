// app/api/factory/process-all/route.ts - FINAL WITH PDF AUTO-EXTRACT
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cleanFormula } from '@/lib/formulaCleaner'
import { extractPDF } from '@/lib/pdfExtractor'

export async function POST() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: pdfs } = await supabase.from('source_pdfs').select('*').eq('status', 'pending').limit(102)

  let totalCreated = 0
  for (const pdf of pdfs || []) {
    const path = pdf.storage_path || pdf.file_path
    const { data: blob } = await supabase.storage.from('source-pdfs').download(path)
    if (!blob) continue

    const extracted = await extractPDF(blob, pdf)

    for (const topic of extracted.topics) {
      const slug = topic.slug
      const cleaned = topic.formulas.map((f: any) => ({ latex: cleanFormula(f.latex), description: f.description, source_pdf_id: pdf.id }))

      const nodes = ['A','B','C','D','E'].map(label => ({
        id: `${slug}-${label}`,
        topic_slug: slug,
        node_label: label,
        level: label,
        title: `${topic.title} - ${label}`,
        caps_code: slug,
        status: 'approved',
        source_pdf_id: pdf.id,
        content: {
          type: label === 'A' ? 'exam_hook' : label === 'B' ? 'concept' : label === 'C' ? 'worked_example' : label === 'D' ? 'traps' : 'challenge',
          body_markdown: label === 'A' ? `From PDF: ${topic.rawText.slice(0,500)}` : topic.title,
          formulas: ['B','C'].includes(label) ? cleaned : [],
          knowledgeRef: `pdf:${pdf.id}`,
          sourcePdfText: topic.rawText.slice(0,3000), // GROUNDED IN PDF
        }
      }))

      await supabase.from('lesson_nodes').upsert(nodes, { onConflict: 'id' })
      totalCreated += 5
    }
    await supabase.from('source_pdfs').update({ status: 'processed' }).eq('id', pdf.id)
  }
  return NextResponse.json({ message: `Created ${totalCreated} from PDFs`, totalCreated, expected: 675 })
}
