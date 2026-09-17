// lib/pdfExtractor.ts - WORKS FOR MIXED 102 PDFs
import { cleanFormula } from './formulaCleaner'

type Chunk = { text: string, source: string, subject: string }

// 1. CHUNK all PDFs once - call this when you upload
export async function ingestMixedPDFs(supabase: any) {
  const { data: pdfs } = await supabase.from('source_pdfs').select('*')
  const allChunks: Chunk[] = []

  for (const pdf of pdfs || []) {
    const text = pdf.caps_data?.text || pdf.rawText || pdf.content || ''
    if (!text) continue

    // Split into 800 char chunks
    const chunks = text.match(/.{1,800}/g) || []
    const subject = detectSubject(pdf.title + ' ' + text)

    chunks.forEach((chunkText, i) => {
      allChunks.push({
        text: chunkText,
        source: pdf.id,
        subject,
      })
    })
  }

  // Save to knowledge table for RAG
  await supabase.from('knowledge_chunks').upsert(
    allChunks.map((c, i) => ({
      id: `chunk-${i}-${Date.now()}`,
      content: c.text,
      source_pdf_id: c.source,
      subject: c.subject,
      // embedding will be added later if you use pgvector, for now keyword search
    })),
    { onConflict: 'id' }
  )
  return allChunks.length
}

function detectSubject(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('physics') || lower.includes('momentum') || lower.includes('newton') || lower.includes('force')) return 'physics'
  return 'maths'
}

// 2. EXTRACT relevant info for SPECIFIC node - searches across ALL chunks
export async function extractForTopic(supabase: any, topicSlug: string, topicTitle: string) {
  // Build search keywords from topic slug
  const keywords = topicSlug.split('-').concat(topicTitle.toLowerCase().split(' '))

  // Keyword search across knowledge_chunks (upgrade to vector later)
  let query = supabase.from('knowledge_chunks').select('*')
  // search for any keyword
  const orFilter = keywords.map(k => `content.ilike.%${k}%`).join(',')
  if (orFilter) query = query.or(orFilter)

  const { data: chunks } = await query.limit(20)

  if (!chunks || chunks.length === 0) {
    // Fallback: get any chunks from source_pdfs matching title
    const { data: pdfs } = await supabase.from('source_pdfs').select('*').ilike('title', `%${topicTitle.split(' ')[0]}%`).limit(5)
    const fallbackText = pdfs?.map((p: any) => p.caps_data?.text || '').join(' ').slice(0, 8000) || ''
    return buildTopicFromText(fallbackText, topicSlug, topicTitle, pdfs?.[0]?.id || 'mixed')
  }

  const combinedText = chunks.map((c: any) => c.content).join('\n---\n')
  const sourceId = chunks[0]?.source_pdf_id || 'mixed'

  return buildTopicFromText(combinedText, topicSlug, topicTitle, sourceId)
}

function buildTopicFromText(text: string, slug: string, title: string, sourceId: string) {
  const formulaPatterns = [/S_n[^\n]{0,60}/gi, /T_n[^\n]{0,60}/gi, /p\s*=\s*m\s*\*\s*v/gi, /F\s*=\s*m\s*\*\s*a/gi, /v\^2/gi]
  let raw: string[] = []
  formulaPatterns.forEach(rx => {
    const m = text.match(rx)
    if (m) raw.push(...m)
  })
  raw = Array.from(new Set(raw)).slice(0, 15)

  const cleaned = raw.map(f => ({ latex: cleanFormula(f), description: `From mixed PDFs for ${title}`, source_pdf_id: sourceId }))

  return {
    slug,
    title,
    formulas: cleaned,
    rawText: text.slice(0, 10000),
    sources: Array.from(new Set(raw.map(() => sourceId))),
    sourceId,
  }
}

// Keep old name for compatibility
export const extractPDF = async (blob: any, meta: any) => {
  return { topics: [await buildTopicFromText(meta.caps_data?.text || meta.title || '', meta.topic_slug || 'mixed-topic', meta.title || 'Mixed', meta.id)] }
}
