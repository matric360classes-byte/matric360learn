// lib/pdfExtractor.ts - GREEN FIX - No external lib needed
import { cleanFormula } from './formulaCleaner'

const TOPIC_MAP: Record<string, string[]> = {
  'arithmetic-series': ['arithmetic series', 'sum of arithmetic'],
  'geometric-series': ['geometric series', 'geometric sequence'],
  'momentum': ['momentum', 'impulse'],
  'newton-second-law': ['newton second', 'net force'],
  'work-energy': ['work', 'kinetic energy'],
}

export async function extractPDF(fileBlob: Blob | null, pdfMeta: any) {
  // Use text already in your table if you have it, else read blob as text fallback
  let text = ''
  if (pdfMeta.caps_data?.text) text = pdfMeta.caps_data.text
  else if (pdfMeta.rawText) text = pdfMeta.rawText
  else if (fileBlob) {
    try { text = await fileBlob.text() } catch { text = pdfMeta.title || '' }
  } else {
    text = pdfMeta.title || ''
  }

  // Find dirty formulas in PDF text (S_n, p = m * v, v^2) - then we clean them
  const patterns = [
    /S_n\s*=\s*[^\n]{2,60}/gi,
    /T_n\s*=\s*[^\n]{2,60}/gi,
    /a_n\s*=\s*[^\n]{2,60}/gi,
    /p\s*=\s*m\s*\*\s*v/gi,
    /F\s*=\s*m\s*\*\s*a/gi,
  ]

  let raw: string[] = []
  patterns.forEach(rx => {
    const m = text.match(rx)
    if (m) raw.push(...m)
  })
  // Also use formulas already saved in your table
  if (pdfMeta.formulas) raw.push(...pdfMeta.formulas.map((f:any) => f.latex || f))

  raw = Array.from(new Set(raw)).slice(0, 20)

  const cleaned = raw.map(latex => ({
    latex: cleanFormula(typeof latex === 'string' ? latex : latex.latex || ''),
    original: latex,
    description: `From PDF: ${pdfMeta.title || pdfMeta.id}`,
  })).filter(f => f.latex.length > 2)

  const lower = (text + ' ' + (pdfMeta.title || '')).toLowerCase()
  let detectedSlug = pdfMeta.topic_slug || pdfMeta.slug || ''
  if (!detectedSlug) {
    for (const [slug, keywords] of Object.entries(TOPIC_MAP)) {
      if (keywords.some(k => lower.includes(k))) { detectedSlug = slug; break }
    }
  }
  if (!detectedSlug) detectedSlug = (pdfMeta.title || pdfMeta.id || 'topic').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)

  const topicTitle = pdfMeta.title || detectedSlug.replace(/-/g, ' ')

  return {
    topics: [{
      slug: detectedSlug,
      title: topicTitle,
      formulas: cleaned,
      rawText: text.slice(0, 10000),
    }],
    totalFormulas: cleaned.length,
  }
}
