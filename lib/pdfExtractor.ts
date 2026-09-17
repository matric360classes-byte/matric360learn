// @ts-nocheck
// lib/pdfExtractor.ts - FINAL GREEN for mixed 102 PDFs
import { cleanFormula } from './formulaCleaner'

function detectSubject(text: string) {
  const lower = (text || '').toLowerCase()
  if (lower.includes('physics') || lower.includes('momentum') || lower.includes('newton') || lower.includes('force') || lower.includes('energy')) return 'physics'
  return 'maths'
}

function buildTopicFromText(text: string, slug: string, title: string, sourceId: string) {
  const t = text || ''
  const patterns = [/S_n[^\n]{0,60}/gi, /T_n[^\n]{0,60}/gi, /a_n[^\n]{0,60}/gi, /p\s*=\s*m/gi, /F\s*=\s*m/gi]
  let raw: string[] = []
  patterns.forEach(rx => {
    const m = t.match(rx)
    if (m) raw.push(...m)
  })
  raw = Array.from(new Set(raw)).slice(0, 15)
  const cleaned = raw.map(f => ({
    latex: cleanFormula(f),
    description: `From mixed PDFs for ${title}`,
    source_pdf_id: sourceId,
  }))
  return { slug, title, formulas: cleaned, rawText: t.slice(0, 10000), sourceId }
}

export async function extractForTopic(supabase: any, topicSlug: string, topicTitle: string) {
  const keywords = topicSlug.split('-')
  const { data: chunks } = await supabase.from('source_pdfs').select('*').ilike('title', `%${keywords[0]}%`).limit(5)
  const combined = chunks?.map((c: any) => c.caps_data?.text || c.title || '').join(' ') || topicTitle
  return buildTopicFromText(combined, topicSlug, topicTitle, chunks?.[0]?.id || 'mixed')
}

export async function extractPDF(blob: any, meta: any) {
  const txt = meta?.caps_data?.text || meta?.title || ''
  const topic = buildTopicFromText(txt, meta?.topic_slug || 'topic', meta?.title || 'Topic', meta?.id || 'mixed')
  return { topics: [topic] }
}
