// lib/pdfExtractor.ts - FINAL GREEN VERSION
import { cleanFormula } from './formulaCleaner'

const TOPIC_MAP: Record<string, string[]> = {
  'arithmetic-series': ['arithmetic series', 'sum of arithmetic'],
  'geometric-series': ['geometric series', 'geometric sequence'],
  'momentum': ['momentum', 'impulse'],
  'newton-second-law': ['newton second', 'net force'],
  'work-energy': ['work', 'kinetic energy'],
}

export async function extractPDF(fileBlob: Blob, pdfMeta: any) {
  // @ts-ignore
  const pdfParse = (await import('pdf-parse')).default
  const buffer = Buffer.from(await fileBlob.arrayBuffer())
  const data = await pdfParse(buffer)
  const text = data.text || ''

  // Simple safe patterns - no $ signs
  const patterns = [
    /S_n\s*=\s*[^\n]{2,60}/gi,
    /T_n\s*=\s*[^\n]{2,60}/gi,
    /a_n\s*=\s*[^\n]{2,60}/gi,
    /p\s*=\s*m\s*\*\s*v/gi,
    /F\s*=\s*m\s*\*\s*a/gi,
    /v\^2|a\^2/gi,
  ]

  let raw: string[] = []
  patterns.forEach(rx => {
    const m = text.match(rx)
    if (m) raw.push(...m)
  })
  raw = Array.from(new Set(raw)).slice(0, 20)

  const cleaned = raw.map(latex => ({
    latex: cleanFormula(latex),
    original: latex,
    description: `From PDF: ${pdfMeta.title || pdfMeta.id}`,
  })).filter(f => f.latex.length > 2)

  const lower = (text + ' ' + (pdfMeta.title || '')).toLowerCase()
  let detectedSlug = pdfMeta.topic_slug || ''
  if (!detectedSlug) {
    for (const [slug, keywords] of Object.entries(TOPIC_MAP)) {
      if (keywords.some(k => lower.includes(k))) {
        detectedSlug = slug
        break
      }
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
