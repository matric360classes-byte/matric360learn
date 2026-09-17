// @ts-nocheck
import { cleanFormula } from './formulaCleaner'
function buildTopicFromText(text, slug, title, sourceId) {
  const t = text || ''
  const raw = (t.match(/S_n|T_n/g) || []).slice(0,10)
  const cleaned = raw.map(f => ({ latex: cleanFormula(f), description: 'From PDFs', source_pdf_id: sourceId }))
  return { slug, title, formulas: cleaned, rawText: t.slice(0,10000), sourceId }
}
export async function extractForTopic(supabase, topicSlug, topicTitle) {
  const { data } = await supabase.from('source_pdfs').select('*').limit(5)
  const combined = data?.map(c => c.title || '').join(' ') || topicTitle
  return buildTopicFromText(combined, topicSlug, topicTitle, data?.[0]?.id || 'mixed')
}
export async function extractPDF(blob, meta) {
  return { topics: [buildTopicFromText(meta?.title || '', 'topic', meta?.title || 'Topic', meta?.id || 'mixed')] }
}
